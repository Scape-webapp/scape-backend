import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { UserDocument } from './user.schema';
import { UserBody } from './dto/create-user.dto';
import { UserUpdate } from './dto/update-user.dto';
import { MongoGridFS } from 'mongo-gridfs';

@Injectable()
export class UserService {
  private fileModel: any;
  constructor(
    @InjectModel('user')
    private UserModel: Model<UserDocument>,
    @InjectConnection() private readonly connection: any,
  ) {
    this.fileModel = new MongoGridFS(this.connection.db, 'fs');
  }

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
    );
  }

  findOne(id: string) {
    return this.UserModel.findById(new mongoose.Types.ObjectId(id));
  }
}
