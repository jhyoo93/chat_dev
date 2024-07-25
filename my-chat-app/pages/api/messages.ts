import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import Message from '../../models/Message';

// MongoDB 연결 함수
async function dbConnect() {
  if (mongoose.connection.readyState >= 1) return;

  return mongoose.connect(process.env.MONGODB_URI!);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    const messages = await Message.find({});
    res.status(200).json(messages);
  } else if (req.method === 'POST') {
    const { user, text } = req.body;
    const newMessage = new Message({ user, text });
    await newMessage.save();
    res.status(201).json(newMessage);
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
