import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class Login {
  @ApiProperty({ required: true })
  @IsString()
  user_name: string;

  @ApiProperty({ required: true })
  @IsString()
  password: string;
}
