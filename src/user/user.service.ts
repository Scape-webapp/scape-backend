import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { UserDocument } from './user.schema';
import { UserBody } from './dto/create-user.dto';
import { UserUpdate } from './dto/update-user.dto';
import { MongoGridFS } from 'mongo-gridfs';
import { GridFSBucketReadStream } from 'mongodb';
import { FileInfoVm } from './fileVo.model';

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

  async readStream(id: string): Promise<GridFSBucketReadStream> {
    const imgReadId = new mongoose.Types.ObjectId(id);
    return await this.fileModel.readFileStream(imgReadId);
  }

  async findInfo(id: string): Promise<FileInfoVm> {
    const imgid = new mongoose.Types.ObjectId(id);
    const result = await this.fileModel
      .findById(imgid)
      .catch(() => {
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      })
      .then((result) => result);
    return {
      filename: result.filename,
      length: result.length,
      chunkSize: result.chunkSize,
      md5: result.md5,
      contentType: result.contentType,
    };
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
