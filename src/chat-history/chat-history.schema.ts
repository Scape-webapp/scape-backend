import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';

export type ChatHistoryDocument = HydratedDocument<ChatHistory>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class ChatHistory {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  user_id: Array<ObjectId>;

  @Prop({ required: true, type: [mongoose.Schema.Types.ObjectId] })
  receiver_id: Array<ObjectId>;
}

export const ChatHistorySchema = SchemaFactory.createForClass(ChatHistory);
