import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatHistoryController } from './chat-history.controller';
import { ChatHistoryService } from './chat-history.service';
import { ChatHistorySchema } from './chat-history.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'chathistory', schema: ChatHistorySchema },
    ]),
  ],
  controllers: [ChatHistoryController],
  providers: [ChatHistoryService],
})
export class ChatHistoryModule {}
