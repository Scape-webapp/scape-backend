import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { UserDocument } from './user.schema';
import { UserBody } from './dto/create-user.dto';
import { UserUpdate } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('user')
    private UserModel: Model<UserDocument>,
  ) {}

  create(userBody: UserBody) {
    return this.UserModel.create(userBody);
  }

  update(userUpdate: UserUpdate) {
    return this.UserModel.findByIdAndUpdate(
      { _id: userUpdate.id },
      userUpdate,
      {
        new: true,
      },
    ).lean();
  }

  findOne(id: string) {
    return this.UserModel.findById(new mongoose.Types.ObjectId(id)).lean();
  }

  // findOne(id: string) {
  //   const userid = new mongoose.Types.ObjectId(id);
  //   return this.UserModel.findById(userid);
  // }

  findFilter(filter: any) {
    return this.UserModel.findOne(filter).lean();
  }
}
