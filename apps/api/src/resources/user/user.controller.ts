import { Public, Session, type UserSession } from '@mguay/nestjs-better-auth';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { type Response } from 'express';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getSession(@Session() session: UserSession) {
    return session;
  }

  @Public()
  @Post('login')
  @ApiBody({
    type: SignInDto,
    description: `Internal endpoint for signing-in using email provider! 
    <br/>
    Note: This is for visualization purposes only!
    <br/>
    You can view their documentation about the usage and integration in their official website!
    <br />
    <hr/>
    Official Endpoint:
    <code>/api/auth/sign-in/email</code>`,
    required: true,
    examples: {
      validUser: {
        summary: 'Valid login example',
        value: {
          email: 'test_user@email.test',
          password: 'password',
        },
      },
      invalidUser: {
        summary: 'Invalid registration example',
        value: {
          email: 'test_user@email.test',
          password: 'password2',
        },
      },
    },
  })
  async login(
    @Body() credential: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      // 1. Fetch to better-auth endpoint
      const internalResponse = await fetch(
        `${process.env.BETTER_AUTH_URL}/api/auth/sign-in/email`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            email: credential.email,
            password: credential.password,
          }),
        },
      );

      // 2. read the response body
      const body = await internalResponse.json();

      if (internalResponse.status !== 200) {
        throw new BadRequestException(body);
      }

      // 3. read the return cookies
      const internalCookies = internalResponse.headers.get('set-cookie');

      // 4. send the cookies to the response
      if (internalCookies) {
        // Forward all cookies from the external response
        res.setHeader('Set-Cookie', internalCookies);
      }

      // 5. return body parsed body
      return body;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }

  @Public()
  @Post('sign-up')
  @ApiBody({
    type: SignUpDto,
    description: `Internal endpoint for signing-up using email provider! 
    <br/>
    Note: This is for visualization purposes only!
    <br/>
    You can view their documentation about the usage and integration in their official website!
    <br />
    <hr/>
    Official Endpoint:
    <code>/api/auth/sign-up/email</code>`,
    required: true,
    examples: {
      validUser: {
        summary: 'Valid signup example',
        value: {
          email: 'test_user@email.test',
          name: 'Test User',
          password: 'password',
        },
      },
      invalidUser: {
        summary: 'Invalid signup example',
        value: {
          email: 'test_user@email.test',
          password: 'password2',
          name: '',
        },
      },
    },
  })
  async signUp(
    @Body() credential: SignUpDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      // 1. fetch the better-auth enpodint for signup
      const internalResponse = await fetch(
        `${process.env.BETTER_AUTH_URL}/api/auth/sign-up/email`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            email: credential.email,
            password: credential.password,
            name: credential.name,
          }),
        },
      );
      // 2. parsed the response body
      const body = await internalResponse.json();

      if (internalResponse.status !== 200) {
        throw new BadRequestException(body);
      }

      // 3. read the return cookies
      const internalCookies = internalResponse.headers.get('set-cookie');

      // 4. send the cookies to the response
      if (internalCookies) {
        // Forward all cookies from the external response
        response.setHeader('Set-Cookie', internalCookies);
      }

      // 5. return body parsed body
      return body;
    } catch (e) {
      Logger.error(e);
      throw new InternalServerErrorException(e);
    }
  }
  @Post('sign-out')
  @ApiBody({
    description: `Internal endpoint for signing-out! 
    <br/>
    Note: This is for visualization purposes only!
    <br/>
    You can view their documentation about the usage and integration in their official website!
    <br />
    <hr/>
    Official Endpoint:
    <code>/api/auth/sign-out</code>`,
  })
  async signOut(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      // 1. fetch the better-auth enpodint for signup
      const internalResponse = await fetch(
        `${process.env.BETTER_AUTH_URL}/api/auth/sign-out`,
        {
          headers: request.headers, // passed all the headers
          method: 'POST',
        },
      );

      // 2. check for error
      if (internalResponse.status !== 200) {
        const body = await internalResponse.json();
        throw new BadRequestException(body);
      }

      // 3. read the return cookies
      const internalCookies = internalResponse.headers.get('set-cookie');

      // 4. send the cookies to the response
      if (internalCookies) {
        // Forward all cookies from the external response
        response.setHeader('Set-Cookie', internalCookies);
      }

      // 5. return body parsed body
      return { success: true };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne({});
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
