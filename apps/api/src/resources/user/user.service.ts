import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/core/entity/user.entity';
import { SignInDto } from 'src/resources/auth/dto/signin.dto';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return this.userRepository.createQueryBuilder();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
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
      const emailCheck = await this.userRepository.findOne({
        where: { email: signinDto.email },
      });

      if (!emailCheck) {
        // todo return invalid credential
      }
      // check password
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
