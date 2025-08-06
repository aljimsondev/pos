import {
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_KEY, CurrentUser } from '@repo/core';
import { Session } from '@repo/schema';
import { compare, hash } from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { User } from 'src/core/entity/user.entity';
import { RedisService } from 'src/core/modules/redis';
import { SecurityRepository } from 'src/core/repository';
import { Device } from 'src/core/services/device.service';
import { Repository } from 'typeorm';

enum TOKEN_STATUS {
  VALID = 'valid',
  REVOKED = 'revoked',
  BLACKLISTED = 'blackedlisted',
}

export interface TokenMutationParams {
  userId: string;
  device: Device;
  refreshToken: string;
}

@Injectable()
export class TokenService {
  private tokenSecret: string;
  private accessTokenExp: number; //in ms
  // refresh token
  private refreshTokenSecret: string;
  private refreshTokenSecretExp: number; //in ms
  private readonly MAX_SESSION_TOKEN: number = 5;
  private readonly REVOKE_DURATION = 30 * 24 * 3600;
  private readonly BLACKLIST_DURATION = 7 * 24 * 3600;
  private readonly salt = 10;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly cache: RedisService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly notificationRepository: SecurityRepository,
  ) {
    this.tokenSecret = configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET');
    this.accessTokenExp = parseInt(
      configService.getOrThrow('JWT_ACCESS_TOKEN_EXP_MS'),
    );
    this.refreshTokenSecret = configService.getOrThrow(
      'JWT_REFRESH_TOKEN_SECRET',
    );
    this.refreshTokenSecretExp = parseInt(
      this.configService.getOrThrow('JWT_REFRESH_TOKEN_EXP_MS'),
    );
  }

  /**
   * Generates a refresh token
   * @param payload - any
   * @returns
   */
  async generateRefreshToken(payload: Record<string, any>) {
    const exp = new Date(Date.now() + this.refreshTokenSecretExp);

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.refreshTokenSecret,
      expiresIn: exp.getTime().toString() + 'ms',
      jwtid: randomUUID().normalize(),
    });

    const TTL = Math.floor((exp.getTime() - Date.now()) / 1000); // TTL in seconds
    await this.cache.set(
      CACHE_KEY.token(refreshToken),
      TOKEN_STATUS.VALID,
      TTL,
    );

    const hashedToken = await this.hashToken(refreshToken);

    return {
      token: refreshToken,
      exp: exp,
      hashedToken,
    };
  }

  async revokeRefreshToken({
    device,
    refreshToken: incomingRefreshToken,
    userId,
  }: TokenMutationParams) {
    const now = new Date();
    const cacheKey = this.getCacheKey(incomingRefreshToken);
    // reference for in-depth implementation https://chat.deepseek.com/a/chat/s/a9faab37-7507-4a45-bd87-d21196454958
    // revoke refreshToken
    // to consider
    // user can logout his/her session when theres a potential suspicious login, when calling this endpoint user refreshtoken should be revoked, and user should logout automatically allowing them to reauathentate
    // steps
    // revoke all sessions from database
    // update the cache status of all sessions

    // 1. Verify token ownership
    const { session, user } = await this.verifyTokenOwnership({
      device,
      refreshToken: incomingRefreshToken,
      userId,
    });

    // 2. Validate device fingerprint
    if (session.device.device_id !== device.device_id) {
      throw new UnauthorizedException('Device fingerprint mismatch');
    }

    // 2. Immediate cache revocation (fail-fast)
    await this.cache.set(cacheKey, 'revoked', this.REVOKE_DURATION);

    // 3. Database revocation (atomic operation)
    // await this.userRepo.update(
    //   {
    //     _id: userId,
    //     'sessions.device.device_id': device.device_id,
    //   },
    //   {
    //     $set: {
    //       'sessions.$.isRevoked': true,
    //       'sessions.$.revokedAt': now,
    //       'sessions.$.revokedReason': 'user_action',
    //     },
    //   },
    // );

    //4. add audit logs
    return {
      success: true,
      revoked_at: now,
    };
  }

  generateAccessToken(payload: Record<string, any>) {
    const exp = new Date(Date.now() + this.accessTokenExp);

    const accessToken = this.jwtService.sign(payload, {
      secret: this.tokenSecret,
      expiresIn: exp.getTime().toString() + 'ms',
    });

    return {
      token: accessToken,
      exp: exp,
    };
  }

  /**
   * Hashed the token and add a prepend to avoid mongo interperting $ as a pipeline special operator
   * @param token
   * @param salt
   * @returns
   */
  async hashToken(token: string) {
    const hashedToken = await hash(token, this.salt);

    // removed the first characterd only which is "$" character
    const strippedPrependHashedToken =
      this.removeHashedTokenPrepend(hashedToken);

    return strippedPrependHashedToken;
  }

  async rotateTokens({
    device,
    refreshToken: incomingRefreshToken,
    userId,
  }: TokenMutationParams) {
    // 1. Verify token ownership (Querying to DB for accurate user data reading)
    const { session, user } = await this.verifyTokenOwnership({
      device,
      refreshToken: incomingRefreshToken,
      userId,
    });

    // 2. Generate new tokens
    const payload: Partial<CurrentUser> = {
      sub: userId,
      did: device.device_id,
      tkv: 1,
    };

    const { token: accessToken, exp } = this.generateAccessToken(payload);

    // 3. Check if refresh token should be rotated
    const shouldRotate = this.shouldRotateToken(session, {
      securityLevel: 'medium',
      absoluteMinTTL: 12 * 60 * 60 * 1000, // 12 hours minimum
      lastUsedThreshold: 7 * 24 * 60 * 60 * 1000, // 7 days inactivity
    });
    Logger.debug('Should Rotate token: ' + shouldRotate);
    // 4. Conditionally handle refresh token
    let refreshToken = incomingRefreshToken;
    let hashedRefreshToken = session.refreshToken;
    let refreshTokenExpiration: Date | null = null;

    // 5. check if token should be rotated
    if (shouldRotate) {
      const { token: newRefreshToken, exp: refreshTokenExp } =
        await this.generateRefreshToken(payload);

      //override old values
      refreshToken = newRefreshToken;
      hashedRefreshToken = await this.hashToken(refreshToken);
      refreshTokenExpiration = refreshTokenExp;

      // 6. Apply circular token strategy
      const activeSessions = user.sessions?.filter((t) => !t.isRevoked) || [];

      if (activeSessions.length >= this.MAX_SESSION_TOKEN) {
        // Revoke oldest session
        const oldestSession = activeSessions.reduce((prev, current) =>
          prev.expiresAt < current.expiresAt ? prev : current,
        );

        // await this.userRepo.update(
        //   { _id: userId, 'sessions.refreshToken': oldestSession.refreshToken },
        //   { $set: { 'sessions.$.isRevoked': true } },
        // );

        // Update cache status to revoked
        await this.cache.set(
          CACHE_KEY.token(oldestSession.refreshToken),
          TOKEN_STATUS.REVOKED,
          this.REVOKE_DURATION,
        );
      }

      // 7. Add new session
      const now = new Date();

      const updateQuery = [
        {
          $set: {
            sessions: {
              $cond: [
                { $in: [device.device_id, '$sessions.device.device_id'] },
                {
                  // If true (device_id exists)
                  $map: {
                    input: '$sessions',
                    in: {
                      $cond: [
                        { $eq: ['$$this.device.device_id', device.device_id] },
                        {
                          // If true (matching device_id), update refresh token value and date uses/expiration
                          $mergeObjects: [
                            '$$this',
                            {
                              refreshToken: hashedRefreshToken,
                              createdAt: now,
                              updatedAt: now,
                              lastUsedAt: now,
                              expiresAt: refreshTokenExp,
                              isRevoked: false,
                            },
                          ],
                        },
                        '$$this', // If false (non-matching IP)
                      ],
                    },
                  },
                },
                '$sessions',
              ],
            },
          },
        },
      ];

      // await this.userRepo.update({ _id: userId }, updateQuery);
    } else {
      // Update last used time for existing token
      // await this.userRepo.update(
      //   { _id: userId, 'sessions.refreshToken': hashedRefreshToken },
      //   { $set: { 'sessions.$.lastUsedAt': new Date() } },
      // );
    }

    // 8. Return new tokens
    return {
      accessToken,
      accessTokenExp: exp,
      refreshToken, // Unhashed version to client
      refreshTokenExp: refreshTokenExpiration,
    };
  }

  private getCacheKey(token: string) {
    const cacheKey = CACHE_KEY.token(token);
    return cacheKey;
  }

  /**
   * Checks if the token has a TOKEN_STATUS.VALID value
   * @param value
   * @returns
   */
  private isValidToken(value: string) {
    return Boolean(value === TOKEN_STATUS.VALID);
  }

  /**
   * Validates the integrity of a given token by checking its format, existence in the cache, and revocation status.
   * @param {string} token - The token to validate.
   * @returns {Promise<void>} A Promise that resolves when validation is successful. If any error occurs during validation, it throws an error.
   * @throws {Error} Will throw various errors based on the validation results:
   *  - "Invalid token format!" if the token format is invalid.
   *  - "Token not found!" if the token doesn't exist in the cache.
   *  - "Token is not valid!" if the token value is not set `valid`.
   *  - A generic error with the message "Token Integrity Validation Failed: Reason: <original error message>" if any other error occurs during validation.
   */
  async validateTokenIntegrity(token: string) {
    const isValidFormat = this.isValidTokenFormat(token);

    if (!isValidFormat) throw new Error('Invalid token format!');

    const tokenCache = await this.getTokenCache(token);
    if (!tokenCache) throw new Error('Token not found!');

    if (!this.isValidToken(tokenCache)) throw new Error('Token is not valid!');
  }

  /**
   * Checks if a given token exists in the cache asynchronously.
   * @param {string} token - The token to check for existence in the cache.
   * @returns {Promise<boolean>} A Promise that resolves to true if the token is found, and false otherwise.
   */
  async isExisted(token: string) {
    const cacheKey = CACHE_KEY.token(token);
    const cachedStatus = (await this.cache.get(cacheKey)) as string;

    return !!cachedStatus;
  }

  async getTokenCache(token: string): Promise<string | null> {
    const cacheKey = CACHE_KEY.token(token);
    const cacheTokenData = (await this.cache.get(cacheKey)) as string;

    return cacheTokenData;
  }

  /**
   * Checks if the provided token value matched to TOKEN_STATUS.REVOKED
   * @param {string} tokenValue - The token value to check for revoked status
   * @returns {boolean}
   */
  private isRevoked(tokenValue: string) {
    return Boolean(tokenValue === TOKEN_STATUS.REVOKED);
  }

  private isValidTokenFormat(token: string): boolean {
    return typeof token === 'string' && token.length >= 64;
  }

  private async reportSuspiciousActivity(userId: string, ip: string) {
    // Implement your security alerting here
    console.warn(`Suspicious activity for user ${userId} from IP ${ip}`);
    await this.notificationRepository.sendSuspiciousLoginNotification();
  }

  /**
   * Determines whether a refresh token should be rotated
   * @param session The current session object
   * @param options Configuration options
   * @returns boolean Whether to rotate the token
   */
  private shouldRotateToken(
    session: Session,
    options: {
      minRemainingPercentage?: number; // Percentage of total TTL remaining before rotation (default: 25%)
      absoluteMinTTL?: number; // Minimum absolute TTL in ms before rotation (safety net)
      securityLevel?: 'low' | 'medium' | 'high';
      lastUsedThreshold?: number; // Max idle time in ms
      requiresRotation?: boolean;
    } = {},
  ): boolean {
    const now = Date.now();
    const expiresAt = new Date(session.expiresAt).getTime();
    const createdAt = new Date(session.createdAt).getTime();
    const lastUsedAt = session.lastUsedAt
      ? new Date(session.lastUsedAt).getTime()
      : createdAt;

    // Calculate TTL values
    const totalTTL = expiresAt - createdAt;
    const remainingTTL = expiresAt - now;

    // Set default thresholds based on security level
    const defaults = {
      low: {
        minRemainingPercentage: 0.1, // 10%
        absoluteMinTTL: 24 * 60 * 60 * 1000, // 1 day
        lastUsedThreshold: 30 * 24 * 60 * 60 * 1000, // 30 days
      },
      medium: {
        minRemainingPercentage: 0.25, // 25%
        absoluteMinTTL: 12 * 60 * 60 * 1000, // 12 hours
        lastUsedThreshold: 7 * 24 * 60 * 60 * 1000, // 7 days
      },
      high: {
        minRemainingPercentage: 0.5, // 50%
        absoluteMinTTL: 2 * 60 * 60 * 1000, // 2 hours
        lastUsedThreshold: 24 * 60 * 60 * 1000, // 1 day
      },
    };

    const securityLevel = options.securityLevel || 'medium';
    const { minRemainingPercentage, absoluteMinTTL, lastUsedThreshold } = {
      ...defaults[securityLevel],
      ...options,
    };

    // Calculate the actual TTL threshold (now properly used!)
    const ttlThreshold = Math.max(
      totalTTL * minRemainingPercentage,
      absoluteMinTTL,
    );

    // Rotation conditions
    return (
      // Condition 1: Token is nearing expiration
      remainingTTL < ttlThreshold ||
      // Condition 2: Token has been inactive too long
      now - lastUsedAt > lastUsedThreshold ||
      // Condition 3: Manual rotation required
      options.requiresRotation === true ||
      // Condition 4: First use after creation
      (!session.lastUsedAt && now - createdAt > 5000) // 5s grace period
    );
  }

  async compareHashedRefreshToken(
    refreshToken: string,
    hashedRefreshToken: string,
  ) {
    Logger.debug('Comparing token hashed...');
    const matchedToken = await compare(refreshToken, hashedRefreshToken);
    Logger.debug('Hashed Compare result: ' + matchedToken);
    if (!matchedToken) throw new ForbiddenException('Token does not matched!');
  }

  private revertHashedTokenRemovedPrepend(hashedToken: string) {
    return '$' + hashedToken;
  }

  private removeHashedTokenPrepend(hashedToken: string, offset?: number) {
    return hashedToken.slice(offset || 1, hashedToken.length);
  }

  private async verifyTokenOwnership({
    device,
    refreshToken,
    userId,
  }: TokenMutationParams) {
    // 1. Get the cache key
    const cacheKey = await this.getCacheKey(refreshToken);

    // 2. Get user details with sessions
    // const user = await this.userRepo.getUserDetails(userId);

    // if (!user) throw new NotFoundException('User not found!');

    // 3. Find matching active token
    // const matchedToken = user.sessions?.find(
    //   (t) => t.device.device_id === device.device_id && !t.isRevoked,
    // );

    // if (!matchedToken) {
    //   // Cache negative result to prevent DB queries
    //   await this.cache.set(
    //     cacheKey,
    //     TOKEN_STATUS.BLACKLISTED,
    //     this.BLACKLIST_DURATION,
    //   );
    //   throw new UnauthorizedException('Invalid or expired token');
    // }

    // // 4. Validate device consistency
    // if (matchedToken.device.device_id !== device.device_id) {
    //   await this.reportSuspiciousActivity(userId, device.ip);
    //   throw new UnauthorizedException('Device mismatch detected!');
    // }

    // // 5. Compare hashed and plain refreshToken

    // // revert the removed prepend "$"
    // const originalHashedToken = this.revertHashedTokenRemovedPrepend(
    //   matchedToken.refreshToken,
    // );

    // // compare refresh token hash
    // await this.compareHashedRefreshToken(refreshToken, originalHashedToken);

    return {
      session: { refreshToken: '', device: { device_id: '' } },
      user: null,
    };
  }
}
