import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageBody } from './dto/message.dto';
import { MessageHistoryBody } from './dto/message-history.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}
  @Post('/')
  async create(@Body() messageBody: MessageBody) {
    try {
      return await this.messageService.create(messageBody);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Post('/history')
  async find(@Body() messageHistoryBody: MessageHistoryBody) {
    try {
      //   messageHistoryBody.to.push(messageHistoryBody.from);
      //   const filters = {
      //     to: { $in: messageHistoryBody.to },
      //     $or: [
      //       { from: messageHistoryBody.from },
      //       { from: messageHistoryBody.to },
      //     ],
      //   };
      return await this.messageService.find(messageHistoryBody);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
