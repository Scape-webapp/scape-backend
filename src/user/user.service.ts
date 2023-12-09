import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './user.schema';
import { UserBody } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('user')
    private UserModel: Model<UserDocument>,
  ) {}

  create(userBody: UserBody) {
    return this.UserModel.create(userBody);
  }
}
