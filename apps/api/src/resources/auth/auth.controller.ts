import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from 'src/resources/auth/auth.service';
import { SignInDto } from 'src/resources/auth/dto/signin.dto';
import { SignUpDto } from 'src/resources/auth/dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({
    type: SignInDto,
    description: 'User credentials for authentication',
    required: true,
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

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register new user',
    description:
      'Creates a new user account with the provided information. Returns an access token upon successful registration.',
  })
  @ApiBody({
    type: SignUpDto,
    description: 'User registration data',
    required: true,
    examples: {
      validUser: {
        summary: 'Valid registration example',
        value: {
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          password: 'SecurePass123!',
          confirm_password: 'SecurePass123!',
        },
      },
      invalidUser: {
        summary: 'Invalid registration example',
        value: {
          first_name: '123', // Invalid: numbers not allowed
          last_name: '', // Invalid: empty
          email: 'invalid-email',
          password: 'simple',
          confirm_password: 'mismatch',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully registered',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '5f8d0a3e5c5a6b2a9c4e3d2f',
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          role: 'cashier',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation error',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'first_name: First name can only contain letters',
          'email: Please enter a valid email address',
          'password: Password must contain at least one special character',
          "confirm_password: Passwords don't match",
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email already registered',
    schema: {
      example: {
        statusCode: 409,
        message: 'Email already registered',
        error: 'Conflict',
      },
    },
  })
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }
}
