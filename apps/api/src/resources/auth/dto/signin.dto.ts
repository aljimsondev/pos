import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({
    name: 'email',
    title: 'email',
    description: 'User registered email',
    example: 'john.doe@email.test',
  })
  email: string;

  @ApiProperty({
    name: 'password',
    title: 'User password',
    description: 'Registered user password',
    example: 'password',
  })
  password: string;
}
