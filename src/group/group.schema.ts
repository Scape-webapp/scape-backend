import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';

export type GroupDocument = HydratedDocument<Group>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Group {
  @Prop({ required: true })
  name: string;

  @Prop()
  profile_image: string;

  @Prop()
  description: string;

  @Prop({ required: true, type: [mongoose.Schema.Types.ObjectId] })
  users: Array<ObjectId>;

  @Prop({ required: true, type: [mongoose.Schema.Types.ObjectId] })
  admins: Array<ObjectId>;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
