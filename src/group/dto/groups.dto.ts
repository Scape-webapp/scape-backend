import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class clearGroupChatDTO {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  groupId: string;
}
