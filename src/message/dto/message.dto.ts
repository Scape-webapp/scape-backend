import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class MessageBody {
  @ApiProperty({ required: true })
  receiver: ObjectId;

  @ApiProperty({ required: true })
  sender: ObjectId;

  @ApiProperty({ required: true })
  @IsString()
  text: string;
}
