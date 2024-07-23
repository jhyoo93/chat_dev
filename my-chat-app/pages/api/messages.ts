import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import { Message } from '../../models/Message';
import { User } from '../../models/User';

const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI!);
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectToDatabase();

    if (req.method === 'POST') {
      const { content, sender, receiver } = req.body;
      console.log("Received request with data:", req.body);  // 디버깅 로그 추가

      if (!content || !sender || !receiver) {
        console.error("Missing content, sender or receiver parameter");  // 디버깅 로그 추가
        return res.status(400).json({ error: 'Missing content, sender or receiver parameter' });
      }

      const senderUser = await User.findOne({ username: sender });
      const receiverUser = await User.findOne({ _id: receiver });

      if (!senderUser || !receiverUser) {
        console.error("Sender or receiver not found");  // 디버깅 로그 추가
        return res.status(404).json({ error: 'Sender or receiver not found' });
      }

      const message = new Message({
        content,
        sender: senderUser._id,
        receiver: receiverUser._id,
        timestamp: new Date()
      });

      await message.save();
      return res.status(201).json(message);
    } else {
      console.error("Method not allowed");  // 디버깅 로그 추가
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error("Internal Server Error:", error);  // 디버깅 로그 추가
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default handler;
