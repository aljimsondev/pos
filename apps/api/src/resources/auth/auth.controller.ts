import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from 'src/resources/auth/auth.service';
import { SignInDto } from 'src/resources/auth/dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({
    type: SignInDto,
    description: 'User credentials for authentication',
    examples: {
      validUser: {
        summary: 'Valid credentials example',
        value: {
          email: 'user@example.com',
          password: 'SecurePass123!',
        },
      },
      invalidUser: {
        summary: 'Invalid credentials example',
        value: {
          email: 'invalid-email',
          password: 'short',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request (validation error)',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'email: Please enter a valid email address',
          'password: Password must be at least 8 characters',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized (invalid credentials)',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized',
      },
    },
  })
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
