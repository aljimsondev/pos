import { BadRequestException, Injectable } from '@nestjs/common';
import { ApiResponse } from '@repo/schema';
import { SignInDto } from 'src/resources/auth/dto/signin.dto';
import { SignUpDto } from 'src/resources/auth/dto/signup.dto';
import { UserService } from 'src/resources/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}
  signIn(payload: SignInDto) {
    try {
      // todo handle signin
      // validate input
      return payload;
    } catch (e) {
      return new BadRequestException(e);
    }
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
