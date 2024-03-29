import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class User {
  @Prop({ required: true, unique: true })
  user_name: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  email: string;

  @Prop()
  name: string;

  @Prop()
  profile_image: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  is_online: boolean;

  @Prop()
  last_online: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
