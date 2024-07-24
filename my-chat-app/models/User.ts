import mongoose, { Document, Model, Schema } from 'mongoose';

interface IUser extends Document {
  username: string;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
