import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
});

export const Chat = mongoose.models.Chat || mongoose.model('Chat', ChatSchema);
