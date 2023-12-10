import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ChatHistoryService } from './chat-history.service';
import { ChatHistoryBody } from './dto/chat-history.dto';

@Controller('chat-history')
export class ChatHistoryController {
  constructor(private readonly chatHistoryService: ChatHistoryService) {}
  @Post('/')
  async create(@Body() chatHistoryBody: ChatHistoryBody) {
    try {
      return await this.chatHistoryService.create(chatHistoryBody);
    } catch (error) {
      throw new HttpException(error.ChatHistory, HttpStatus.BAD_REQUEST);
    }
  }
}
