import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

  findOne(filter) {
    return this.GroupModel.findOne(filter);
  }

  update(id: number, updateGroupDto: UpdateGroupDto) {
    return this.GroupModel.findByIdAndUpdate(id, updateGroupDto);
  }
}
