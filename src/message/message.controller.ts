import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageBody } from './dto/message.dto';
import { MessageChatBody } from './dto/message-history.dto';
import { AuthGuard } from 'src/auth/auth.guard';
@UseGuards(AuthGuard)
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
      const ids = [];
      ids.push(messageChatBody.receiver);
      ids.push(messageChatBody.sender);

      const filters = {
        $and: [
          { receiver: { $in: ids }, sender: { $in: ids } },
          { archive: { $nin: messageChatBody.sender } },
        ],
      };
      return this.messageService.find(filters);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/clear-chat')
  async clearChat(@Body() messageChatBody: MessageChatBody) {
    try {
      const ids = [];
      ids.push(messageChatBody.sender);
      ids.push(messageChatBody.receiver);

      const filter = {
        receiver: { $in: ids },
        sender: { $in: ids },
      };
      return this.messageService.findandUpdate(filter, {
        $push: { archive: messageChatBody.sender },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
