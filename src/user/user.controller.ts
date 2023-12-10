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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
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
  async findOne(@Param() id: string) {
    try {
      return await this.userService.findOne(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
