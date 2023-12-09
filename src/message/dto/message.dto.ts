import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class MessageBody {
  @ApiProperty({ required: true })
  to: Array<ObjectId>;

  @ApiProperty({ required: true })
  @IsObject()
  from: ObjectId;

  @ApiProperty({ required: true })
  @IsString()
  text: string;
}
