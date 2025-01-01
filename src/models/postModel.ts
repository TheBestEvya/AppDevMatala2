import mongoose from "mongoose";
import {commentSchema} from "./commentModel"

const postSchema = new mongoose.Schema({

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

  const postModel = mongoose.model("posts", postSchema);

  export default postModel;