import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { MessageBody } from './dto/message.dto';
import { MessageDocument } from './message.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel('message')
    private MessageModel: Model<MessageDocument>,
  ) {}

  create(messageBody: MessageBody) {
    return this.MessageModel.create(messageBody);
  }

  find(filter) {
    return this.MessageModel.find(filter).sort({ createdAt: 1 }).lean();
  }

  findOne(id: string) {
    return this.MessageModel.findById(id);
  }

  fetchLastMsgList(id: string) {
    const userId = new mongoose.Types.ObjectId(id);
    return this.MessageModel.aggregate([
      {
        $match: {
          $or: [
            {
              sender: userId,
            },
            {
              receiver: {
                $eq: userId,
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: {
            receiver: '$receiver',
            sender: '$sender',
          },
          text: {
            $last: '$text',
          },
          createdAt: {
            $last: '$createdAt',
          },
        },
      },
      {
        $project: {
          _id: {
            $cond: {
              if: {
                $eq: ['$_id.receiver', userId],
              },
              then: '$_id.sender',
              else: '$_id.receiver',
            },
          },
          text: 1,
          createdAt: 1,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
        },
      },
      {
        $project: {
          'user.password': 0,
          'user.createdAt': 0,
          'user.updatedAt': 0,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);
  }

  findandUpdate(filter, update) {
    return this.MessageModel.updateMany(filter, update, { new: true });
  }

  fetchGroupMsg(grpId: string, uId: string) {
    const groupId = new mongoose.Types.ObjectId(grpId);
    const userId = new mongoose.Types.ObjectId(uId);
    return this.MessageModel.aggregate([
      {
        $match: {
          groupId: groupId,
          archive: { $nin: [userId] },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'sender',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
        },
      },
      {
        $project: {
          'user.password': 0,
          'user.createdAt': 0,
          'user.updatedAt': 0,
          'user.description': 0,
          'user.email': 0,
        },
      },
    ]);
  }
}
