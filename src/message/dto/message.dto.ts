import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class MessageBody {
  @ApiProperty({ required: true })
  receiver: Array<ObjectId>;

  @ApiProperty({ required: true })
  @IsObject()
  sender: ObjectId;

  @ApiProperty({ required: true })
  @IsString()
  text: string;
}
