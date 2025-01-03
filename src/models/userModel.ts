import mongoose from "mongoose"

export interface IUser {
    id?: mongoose.Schema.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    refreshToken? : string[];
  }
const userSchema = new mongoose.Schema<IUser>({
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // email regex
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    refreshToken: {
      type: [String],
      default: [],
    }
  });

const userModel = mongoose.model<IUser>("users",userSchema)

export default userModel;