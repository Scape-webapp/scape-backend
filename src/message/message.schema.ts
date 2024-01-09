import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Message {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  receiver: ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  sender: ObjectId;

  @Prop({ required: true })
  text: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
