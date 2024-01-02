import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';
import { Date, ObjectId } from 'mongoose';

export class UserUpdate {
  @ApiProperty({ required: true })
  id: ObjectId;

  @ApiProperty()
  @IsString()
  user_name: string;

  // @ApiProperty({ required: true })
  // @IsEmail()
  // email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  // @IsString()
  @IsOptional()
  profile_image: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  is_online: boolean;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  last_online: Date;
}
