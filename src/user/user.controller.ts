import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserBody } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserUpdate } from './dto/update-user.dto';
import { Login } from './dto/login-user.dto';
import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  async create(@Body() userBody: UserBody) {
    try {
      userBody.password = await bcrypt.hash(userBody.password, 10); // const isMatch = await bcrypt.compare(password, hash);

      await this.userService.create(userBody);
      return { message: 'created successfully!' };
    } catch (error) {
      if (error.code === 11000 && error.message.includes('user_name')) {
        throw new HttpException(
          'user_name already taken!',
          HttpStatus.BAD_REQUEST,
        );
      } else if (error.code === 11000 && error.message.includes('email')) {
        throw new HttpException(
          'email already in use!',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        console.log('error : ', error);
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  @Patch('/')
  async update(@Body() userUpdate: UserUpdate) {
    try {
      return await this.userService.update(userUpdate);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/:id')
  async findById(@Param() id: string) {
    try {
      return await this.userService.findOne(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/login')
  async login(@Body() login: Login) {
    try {
      let user: any = await this.userService.findFilter({
        user_name: login.user_name,
      });

      const isMatch = await bcrypt.compare(login.password, user.password);
      console.log({ isMatch });
      if (isMatch) {
        const accessToken = jwt.sign(
          { user_name: login.user_name },
          process.env.ACCESS_SECRET as string,
          {
            expiresIn: '60m',
          },
        );
        const refreshToken = jwt.sign(
          { user_name: login.user_name },
          process.env.REFRESH_SECRET as string,
          {
            expiresIn: '7d',
          },
        );
        user = _.omit(user, ['password']);
        return { accessToken, refreshToken, user: user };
      } else {
        throw new Error('Invalid Username or password!');
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
