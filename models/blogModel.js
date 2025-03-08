import { Schema, model, models } from "mongoose";

const CommentSchema = new Schema({
  content: {
    type: String,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const blogPostSchema = new Schema(
  {
    title: {
      type: String,
    },
    content: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    category: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    comments: [CommentSchema],
    upvotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

blogPostSchema.index({ title: "text" });

const BlogPost = models.BlogPost || model("BlogPost", blogPostSchema);
export default BlogPost;
