import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserBody } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserUpdate } from './dto/update-user.dto';
import { Login, refreshTkn } from './dto/login-user.dto';
import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';
import { AuthGuard } from 'src/auth/auth.guard';

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

  @UseGuards(AuthGuard)
  @Patch('/')
  async update(@Body() userUpdate: UserUpdate) {
    try {
      return await this.userService.update(userUpdate);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Get('/search/:username')
  async findByUsername(@Param('username') username: string) {
    try {
      return this.userService.findByUsername(username);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async findById(@Param() id: string) {
    try {
      return await this.userService.findOne(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @HttpCode(200)
  @Post('/login')
  async login(@Body() login: Login) {
    try {
      let user: any = await this.userService.findFilter({
        user_name: login.user_name,
      });

      const isMatch = await bcrypt.compare(login.password, user.password);
      if (isMatch) {
        const accessToken = jwt.sign(
          { user_name: login.user_name, _id: user?._id },
          process.env.ACCESS_SECRET as string,
          {
            expiresIn: '60m',
          },
        );
        const refreshToken = jwt.sign(
          { user_name: login.user_name, _id: user?._id },
          process.env.REFRESH_SECRET as string,
          {
            expiresIn: '7d',
          },
        );

        user = _.omit(user, ['password']);
        return { accessToken, refreshToken, user: user };
      } else {
        throw new HttpException(
          'Invalid Username or password!',
          HttpStatus.CONFLICT,
        );
      }
    } catch (error) {
      throw new HttpException(
        error.message || 'Something went wrong!',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('/refresh')
  async refresh(@Body() refersh: refreshTkn) {
    try {
      const decoded: any = jwt.verify(
        refersh.token,
        process.env.REFRESH_SECRET as string,
      );

      if (decoded.user_name !== refersh.user_name) {
        throw new HttpException(
          'Invalid token,try login again',
          HttpStatus.BAD_REQUEST,
        );
      }
      const accessToken = jwt.sign(
        { user_name: refersh.user_name, _id: refersh.userId },
        process.env.ACCESS_SECRET as string,
        {
          expiresIn: '60m',
        },
      );

      return { success: true, accessToken };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
