import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '../../../lib/mongodb';
import User from '../../../models/User';
import mongoose from 'mongoose';

async function dbConnect() {
  if (mongoose.connection.readyState >= 1) return;

  return mongoose.connect(process.env.MONGODB_URI!);
}

const secret = process.env.NEXTAUTH_SECRET;
if (!secret) {
  throw new Error('Please add your NextAuth secret to .env.local');
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('No credentials provided');
        }

        await dbConnect();
        const user = await User.findOne({ email: credentials.email });

        if (user && user.password === credentials.password) {
          return { id: user._id, name: user.name, email: user.email };
        }
        return null;
      }
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string; // 타입 단언을 사용하여 unknown을 string으로 변환
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  secret,
  pages: {
    signIn: '/signin', // 커스텀 로그인 페이지 경로
  },
});
