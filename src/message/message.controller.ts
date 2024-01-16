import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageBody } from './dto/message.dto';
import { MessageChatBody, MessageHistoryBody } from './dto/message-history.dto';
// import { MessageHistoryBody } from './dto/message-history.dto';
import mongoose, { ObjectId } from 'mongoose';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}
  @Post('/')
  async create(@Body() messageBody: MessageBody) {
    try {
      return this.messageService.create(messageBody);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  // @Post('/history')
  // async find(@Body() messageHistoryBody: MessageHistoryBody) {
  //   try {
  //     const filters = {
  //       $or: [
  //         {
  //           sender: messageHistoryBody.id,
  //         },
  //         {
  //           receiver: messageHistoryBody.id,
  //         },
  //       ],
  //     };
  //     return this.messageService.find(filters);
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }
  // }
  @Get('/chat-list/:id')
  async ChatList(@Param() id: string) {
    try {
      return this.messageService.fetchLastMsgList(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Post('/chat')
  async find(@Body() messageChatBody: MessageChatBody) {
    try {
      const receiverId = new mongoose.Types.ObjectId(
        messageChatBody.receiver.toString(),
      );
      const senderId = new mongoose.Types.ObjectId(
        messageChatBody.sender.toString(),
      );
      const filters = {
        // receiver: messageChatBody.receiver,
        // sender: messageChatBody.receiver,
        sender: {
          $or: [{ receiver: receiverId }, { sender: senderId }],
        },
        receiver: {
          $or: [{ receiver: receiverId }, { sender: senderId }],
        },
      };
      return this.messageService.find(filters);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
