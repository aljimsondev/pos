import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { APP_ERROR, BusinessError } from '@repo/core';
import { User } from 'src/core/entity/user.entity';
import { SignInDto } from 'src/resources/auth/dto/signin.dto';
import { SignUpDto } from 'src/resources/auth/dto/signup.dto';
import { FindOneOptions, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(signUpDto: SignUpDto) {
    try {
      // check use existence
      const user = await this.userRepository.findOne({
        where: { email: signUpDto.email },
      });

      // checks if email already used
      if (user) {
        throw new BusinessError(APP_ERROR.auth.email_taken);
      }

      // create new user
      const newUser = new User();
      newUser.first_name = signUpDto.first_name;
      newUser.last_name = signUpDto.last_name;
      newUser.password = signUpDto.password;
      newUser.role = signUpDto.role;
      newUser.email = signUpDto.email;
      // save user
      return this.userRepository.save(newUser);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  findAll() {
    return this.userRepository.createQueryBuilder();
  }

  findOne(options: FindOneOptions<User>) {
    try {
      return this.userRepository.findOne(options);
    } catch (e) {
      throw new Error(e);
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async signIn(signinDto: SignInDto) {
    try {
      // todo manage signin
      // 1. checks email
      // 2. validate password
      const user = await this.userRepository.findOne({
        where: { email: signinDto.email },
      });

      if (!user) {
        // todo return invalid credential
      }
      const isMatched = await user?.comparePassword(signinDto.password);
      // check password
      if (!isMatched) {
        // todo return invalid credential
      }
      // todo generate token and send it to the client
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
