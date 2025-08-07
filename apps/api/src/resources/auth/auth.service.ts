import { BadRequestException, Injectable } from '@nestjs/common';
import { APP_ERROR, BusinessError } from '@repo/core';
import { ApiResponse } from '@repo/schema';
import { SignInDto } from 'src/resources/auth/dto/signin.dto';
import { SignUpDto } from 'src/resources/auth/dto/signup.dto';
import { UserService } from 'src/resources/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async signIn(credential: SignInDto) {
    const user = await this.userService.findOne({
      where: { email: credential.email },
    });

    if (!user) throw new BusinessError(APP_ERROR.auth.invalid_credentials);

    const passwordMatched = await user.comparePassword(credential.password);

    if (!passwordMatched)
      throw new BusinessError(APP_ERROR.auth.invalid_credentials);

    // generate token, refresh token etc.
  }

  async signUp(
    signUpDto: SignUpDto,
  ): Promise<ApiResponse<{ id: number; created_at: Date }>> {
    try {
      const user = await this.userService.create(signUpDto);

      return {
        success: true,
        status: 201,
        data: {
          id: user.id,
          created_at: user.created_at,
        },
      };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
