import { BadRequestException, Injectable } from '@nestjs/common';
import { SignInDto } from 'src/resources/auth/dto/signin.dto';
import { UserService } from 'src/resources/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}
  signIn(payload: SignInDto) {
    try {
      // todo handle signin
    } catch (e) {
      return new BadRequestException(e);
    }
  }
}
