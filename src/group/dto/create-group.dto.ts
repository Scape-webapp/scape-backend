import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

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
}
