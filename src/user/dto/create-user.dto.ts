import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
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
  @IsString()
  password: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  profile_image: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  is_online: boolean;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  last_online: Date;
}
