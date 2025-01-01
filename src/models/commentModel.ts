import  mongoose from "mongoose";

export const commentSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'posts',
      required : true
    },
    text: {
      type: String,
      required: true
    }
  });

  const commentModel = mongoose.model("comments", commentSchema)

  export default commentModel