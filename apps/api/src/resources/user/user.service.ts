import { BadRequestException, Injectable } from '@nestjs/common';

import { User } from 'src/core/entity/user.entity';
import { FindOneOptions } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor() {}
  create(signUpDto: any) {
    try {
      // todo
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  findAll() {}

  findOne(options: FindOneOptions<User>) {
    try {
      // todo
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
}
