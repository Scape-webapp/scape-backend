import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateGroupDto {
  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  profile_image: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsArray()
  users: ObjectId[];

  @ApiProperty()
  @IsArray()
  admins: ObjectId[];
}
