import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupSchema } from './group.schema';
import { MessageService } from 'src/message/message.service';
import { MessageSchema } from 'src/message/message.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'group', schema: GroupSchema },
      { name: 'message', schema: MessageSchema },
    ]),
    AuthModule,
  ],
  controllers: [GroupController],
  providers: [GroupService, MessageService],
})
export class GroupModule {}
