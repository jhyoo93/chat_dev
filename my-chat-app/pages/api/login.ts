import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
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
      const { username } = req.body;
      if (!username) {
        return res.status(400).json({ error: 'Missing username parameter' });
      }

      let user = await User.findOne({ username });
      if (!user) {
        user = new User({ username });
        await user.save();
      }

      return res.status(200).json(user);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default handler;
