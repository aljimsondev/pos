import { signupSchema } from '@repo/schema';

import { createZodDto } from 'nestjs-zod';

export class SignUpDto extends createZodDto(signupSchema) {}
