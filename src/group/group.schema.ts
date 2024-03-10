import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';

export type GroupDocument = HydratedDocument<Group>;

const PastUserSchema = new mongoose.Schema({
  pastUserId: { type: mongoose.Schema.Types.ObjectId },
});

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

  @Prop({ type: [PastUserSchema] })
  past_users: Array<{ pastUserId: ObjectId; timestamps: true }>;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
