import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  user: String,
  text: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
