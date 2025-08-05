import { Injectable } from '@nestjs/common';
import { SignInDto } from 'src/resources/auth/dto/signin.dto';

@Injectable()
export class AuthService {
  signIn(payload: SignInDto) {}
}
