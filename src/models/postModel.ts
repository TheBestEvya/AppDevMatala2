import mongoose from "mongoose";
import {commentSchema} from "./commentModel"

export interface IPost{
    title: string;
    content: string;
    comments: Array<typeof commentSchema>;
    sender: mongoose.Schema.Types.ObjectId
}
const postSchema = new mongoose.Schema<IPost>({

    title: {
        type: String,
        required: true
      },
      content: {
        type: String,
        required: true
      },
      comments: [commentSchema],
      sender : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
      }
    });

  const postModel = mongoose.model<IPost>("posts", postSchema);

  export default postModel;
  