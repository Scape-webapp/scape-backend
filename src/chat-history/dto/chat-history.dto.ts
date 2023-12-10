import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class ChatHistoryBody {
  @ApiProperty({ required: true })
  user_id: Array<ObjectId>;

  @ApiProperty({ required: true })
  @IsString()
  receiver_id: Array<ObjectId>;
}
