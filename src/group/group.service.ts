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

  getGroupInfo(id: string) {
    const groupId = new mongoose.Types.ObjectId(id);
    return this.GroupModel.aggregate([
      {
        $match: {
          _id: groupId,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'users',
          foreignField: '_id',
          as: 'grpmember',
        },
      },
    ]);
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
        $set: {
          islastMessage: {
            $last: '$message',
          },
        },
      },
      {
        $sort: {
          'islastMessage.createdAt': -1,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'islastMessage.sender',
          foreignField: '_id',
          as: 'lastMsgName',
        },
      },
      {
        $unwind: {
          path: '$lastMsgName',
        },
      },
      {
        $project: {
          'lastMsgName.password': 0,
          'lastMsgName.createdAt': 0,
          'lastMsgName.updatedAt': 0,
          'lastMsgName.description': 0,
          'lastMsgName.email': 0,
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

  update(id: string, updateGroupDto: UpdateGroupDto) {
    return this.GroupModel.findByIdAndUpdate(id, updateGroupDto);
  }

  findByGrpName(grpname: string) {
    return this.GroupModel.findOne({
      name: grpname,
    }).lean();
  }
}
