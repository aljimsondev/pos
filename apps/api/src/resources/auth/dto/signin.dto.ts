import { signInSchema } from '@repo/schema';
import { createZodDto } from 'nestjs-zod';

export class SignInDto extends createZodDto(signInSchema) {}
