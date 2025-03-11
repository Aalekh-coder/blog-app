"use client";

import { addCommentAction } from "@/actions/blogInteractions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageCircleIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import * as z from "zod";

const schema = z.object({
  content: z.string().min(1, "Comment is required"),
});

function BlogDetails({ post }) {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(schema),
  });

  async function onCommentSubmit(data) {
    setIsLoading(true);
    
    try {
      const result = await addCommentAction({ ...data, postId: post._id });
      if (result.success) {
        toast.success("Comment added successfully");
        reset();
      } else {
        toast.error("Comment added failed");
        throw new Error(result.error);
      }
    } catch (error) {
      console.log(error);
      toast.error("Comment added failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post?.title}</h1>
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>{post?.author?.name || ""}</AvatarFallback>
          </Avatar>

          <div>
            <p className="text-xl font-medium">{post?.author?.name}</p>
          </div>
          <div className="flex justify-between items-center my-8">
            <div className="flex space-x-4">
              <Button varient="ghost" size="sm">
                <MessageCircleIcon className="h-8 w-8" />
                {post?.comments?.length}
              </Button>
            </div>
          </div>
        </div>
      </header>
      {post?.coverImage && (
        <img
          src={post?.coverImage}
          className="w-full h-96 object-cover rounded-lg mb-8"
        />
      )}

      <article className="prose lg:prose-xl ">
        <div dangerouslySetInnerHTML={{ __html: post?.content }} />
      </article>

      {/* comment form  */}

      <form onSubmit={handleSubmit(onCommentSubmit)} className="mt-5">
        <Textarea
          placeholder="Add a comment..."
          className="w-full mb-4"
          rows={4}
          {...register("content")}
        />
        <Button type="submit" disabled={isLoading}>
          Submit Comment
        </Button>
      </form>

      <div className="my-8">
        <h3 className="text-xl font-bold mb-4">
          Comments {post?.comments?.length}
        </h3>

        
        {post?.comments?.map((comment, index) => (
          <div key={index} className="border-b py-4">
            <div className="flex items-center space-x-2 mb-2">
              <Avatar>
                <AvatarFallback>{comment?.author[0]}</AvatarFallback>
              </Avatar>
              <p className="font-medium">{comment?.author}</p>
            </div>
            <p>{comment?.content}</p>
          </div>
        ))}
      </div>
      <Toaster />
    </div>
  );
}

export default BlogDetails;
