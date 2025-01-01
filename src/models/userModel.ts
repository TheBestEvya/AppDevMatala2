import mongoose from "mongoose"


const userSchema = new mongoose.Schema({
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
  });

const userModel = mongoose.model("users",userSchema)

export default userModel;