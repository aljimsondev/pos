import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/core/entity/user.entity';
import { SignInDto } from 'src/resources/auth/dto/signin.dto';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  create(createUserDto: CreateUserDto) {
    try {
      //todo add user
      // 1. check if user existed
      const user = new User();
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
