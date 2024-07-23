import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import { Chat } from '../../models/Chat';
import { User } from '../../models/User';

const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI!);
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectToDatabase();

    if (req.method === 'GET') {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ error: 'Missing userId parameter' });
      }

      console.log(`Fetching chats for user: ${userId}`); // 디버깅 로그 추가

      const user = await User.findOne({ username: userId });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const chats = await Chat.find({ users: user._id }).populate('users').populate('messages');
      return res.status(200).json(chats);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error fetching chats:', error); // 디버깅 로그 추가
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default handler;
