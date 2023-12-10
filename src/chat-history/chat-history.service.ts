import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatHistoryDocument } from './chat-history.schema';
import { ChatHistoryBody } from './dto/chat-history.dto';

@Injectable()
export class ChatHistoryService {
  constructor(
    @InjectModel('chathistory')
    private ChatHistoryModel: Model<ChatHistoryDocument>,
  ) {}

  create(chatHistoryBody: ChatHistoryBody) {
    return this.ChatHistoryModel.create(chatHistoryBody);
  }
}
