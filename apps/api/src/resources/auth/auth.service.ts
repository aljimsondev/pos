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
      return this.userService.create(signUpDto);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
