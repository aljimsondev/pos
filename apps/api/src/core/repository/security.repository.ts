import { Injectable } from '@nestjs/common';
import { AppError } from '@repo/core';

@Injectable()
export class SecurityRepository extends AppError {
  constructor() {
    super(SecurityRepository);
  }

  //todo add notification methods here
  async sendSuspiciousLoginNotification() {}
}
