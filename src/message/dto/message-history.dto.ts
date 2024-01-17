import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';

export class MessageHistoryBody {
  // @ApiProperty({ required: true })
  // receiver: ObjectId;

  @ApiProperty({ required: true })
  id: ObjectId;
}

export class MessageChatBody {
  @ApiProperty({ required: true })
  receiver: ObjectId;

  @ApiProperty({ required: true })
  sender: ObjectId;
}
