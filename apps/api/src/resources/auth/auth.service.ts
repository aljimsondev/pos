import { BadRequestException, Injectable } from '@nestjs/common';
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

  async signUp(signUpDto: SignUpDto) {
    try {
      const user = await this.userService.create(signUpDto);

      return {
        success: true,
        payload: {
          id: user.id,
          created_at: user.created_at,
        },
      };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
