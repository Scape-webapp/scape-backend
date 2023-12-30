import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserBody } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserUpdate } from './dto/update-user.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('Attachments')
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

  // @Patch('/')
  // @UseInterceptors(FileInterceptor('file'))
  // async update(@UploadedFile() file, @Body() userUpdate: UserUpdate) {
  //   try {
  //     if (file) {
  //       Logger.debug(file, 'FILE UPLOADER');
  //     }
  //     return await this.userService.update(userUpdate);
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }
  // }

  @Get('/:id')
  async findById(@Param() id: string) {
    try {
      return await this.userService.findOne(id);
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
  upload(@UploadedFile() files) {
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
  }
}
