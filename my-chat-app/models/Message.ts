import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  content: String,
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now },
});

export const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);
