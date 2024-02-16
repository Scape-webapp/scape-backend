import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { GroupDocument } from './group.schema';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel('group')
    private GroupModel: Model<GroupDocument>,
  ) {}

  create(createGroupDto: CreateGroupDto) {
    return this.GroupModel.create(createGroupDto);
  }

  findAll() {
    return this.GroupModel.find();
  }

  fetchGroupList(id: string) {
    const userId = new mongoose.Types.ObjectId(id);
    return this.GroupModel.aggregate([
      {
        $match: {
          $or: [
            {
              users: {
                $eq: userId,
              },
            },
            {
              past_users: {
                $elemMatch: {
                  pastUserId: userId,
                },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'messages',
          localField: '_id',
          foreignField: 'groupId',
          as: 'message',
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'message.sender',
          foreignField: '_id',
          as: 'senderName',
        },
      },

      // handle username later

      // { $unwind: { path: '$message' } },
      // { $unwind: { path: '$senderName' } },
      // {
      //   $project: {
      //     text: '$message.text',
      //     createdAt: '$message.createdAt',
      //     name: '$name',
      //     userName: '$senderName.user_name',
      //   },
      // },
    ]);
  }

  findOne(filter) {
    return this.GroupModel.findOne(filter);
  }

  update(id: number, updateGroupDto: UpdateGroupDto) {
    return this.GroupModel.findByIdAndUpdate(id, updateGroupDto);
  }
  findByGrpName(grpname: string) {
    return this.GroupModel.findOne({
      name: grpname,
    }).lean();
  }
}
