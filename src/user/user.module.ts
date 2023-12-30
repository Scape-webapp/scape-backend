import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';
import { MulterModule } from '@nestjs/platform-express';
import { GridFsMulterConfigService } from 'src/multer-config.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'user', schema: UserSchema }]),
    MulterModule.registerAsync({
      useClass: GridFsMulterConfigService,
    }),
  ],
  controllers: [UserController],
  providers: [UserService, GridFsMulterConfigService],
})
export class UserModule {}
