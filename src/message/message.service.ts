import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageBody } from './dto/message.dto';
import { MessageDocument } from './message.schema';
// import { MessageHistoryBody } from './dto/message-history.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel('message')
    private MessageModel: Model<MessageDocument>,
  ) {}

  create(messageBody: MessageBody) {
    return this.MessageModel.create(messageBody);
  }
  find(filter) {
    return this.MessageModel.find(filter);
  }
}
