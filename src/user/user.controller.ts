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
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserBody } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserUpdate } from './dto/update-user.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Login } from './dto/login-user.dto';
import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';

@Controller('user')
@ApiTags('Attachments')
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

  @Post('/img')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('file'))
  upload(@UploadedFiles() files) {
    try {
      const response = [];
      files.forEach((file) => {
        const fileReponse = {
          originalname: file.originalname,
          encoding: file.encoding,
          mimetype: file.mimetype,
          id: file.id,
          filename: file.filename,
          metadata: file.metadata,
          bucketName: file.bucketName,
          chunkSize: file.chunkSize,
          size: file.size,
          md5: file.md5,
          uploadDate: file.uploadDate,
          contentType: file.contentType,
        };
        response.push(fileReponse);
      });
      console.log('first', response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  @Get('/img/:id')
  // @ApiBadRequestResponse({ type: any })
  async getFile(@Param('id') id: string, @Res() res) {
    try {
      console.log(id);
      const file = await this.userService.findInfo(id);
      console.log(file);
      const filestream = await this.userService.readStream(id);
      console.log(filestream);
      if (!filestream) {
        throw new HttpException(
          'An error occurred while retrieving file',
          HttpStatus.EXPECTATION_FAILED,
        );
      }
      res.header('Content-Type', file.contentType);
      console.log(file.contentType);
      return filestream.pipe(res);
    } catch (error) {
      console.log(error);
    }
  }
}
