import { BadRequestException, Injectable } from '@nestjs/common';
import { APP_ERROR } from 'src/core/constants/error.constants';
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
      const user = await this.userService.findOne({
        where: { email: signUpDto.email },
      });

      // checks if email already used
      if (!user) {
        throw new BadRequestException(APP_ERROR.auth.email_taken);
      }

      // hashed the password

      return signUpDto;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
