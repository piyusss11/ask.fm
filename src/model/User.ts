import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  content: string;
  createdAt: Date;
}
const MessageSchema: Schema<IMessage> = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  verificationToken: string;
  verificationTokenExpiry: Date;
  isAcceptingMessages: boolean;
  messages: IMessage[];
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Please use a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, "Verification token is required"],
  },
  verificationTokenExpiry: {
    type: Date,
    required: [true, "Verification token is required"],
  },
  isAcceptingMessages: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema],
});

const UserModel =
  (mongoose.models.users as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("users", UserSchema);
export default UserModel;

