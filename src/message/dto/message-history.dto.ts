import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';
import { ObjectId } from 'mongoose';

export class MessageHistoryBody {
  @ApiProperty({ required: true })
  receiver: Array<ObjectId>;

  @ApiProperty({ required: true })
  sender: ObjectId;
}
