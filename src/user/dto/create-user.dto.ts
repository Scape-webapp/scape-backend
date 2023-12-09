import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';
import { Date } from 'mongoose';

export class UserBody {
  @ApiProperty({ required: true })
  @IsString()
  user_name: string;

  @ApiProperty({ required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true })
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  profile_image: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  is_online: boolean;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  last_online: Date;
}