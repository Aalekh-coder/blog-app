"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BLOG_CATEGORIES } from "@/lib/config";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadButton } from "@uploadthing/react";
import { PlusCircle } from "lucide-react";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { useRouter } from "next/navigation";
import "@uploadthing/react/styles.css";


const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";
import "./quill-custom.css";

const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  category: z.string().min(1, "category is required"),
  coverImage: z.string().min(1, "coverImage is required"),
});

const isSuspiciousContent = (data) => {
  const suspiciousPatterns = [
    /<script>/i,
    /javascript:/i,
    /onload=/i,
    /onclick=/i,
    /'.*OR.*'/i,
    /UNION SELECT/i,
  ];

  return suspiciousPatterns.some((pattern) => pattern.test(data.content));
};

const CreateBlogForm = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [quillLoaded, setQuillLoaded] = useState(false);
  const quillRef = useRef(null);

  const router = useRouter();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
      coverImage: "",
    },
  });

  const title = watch("title");
  const category = watch("category");
  const content = watch("content");
  const coverImage = watch("coverImage");

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ color: [] }, { background: [] }],
        ["blockquote", "code-block"],
        ["link"],
        ["clean"],
      ],
    }),
    []
  );

  // const onBlogSubmit = async (data) => {
  //   setIsLoading(true);

  //   try {
  //     const isSuspiciousInput = isSuspiciousContent(data);

  //     const result = await fetch("/api/create-blog-post", {
  //       method: "POST",
  //       headers: {
  //         "Content-type": "application/json",
  //         "x-arcjet-suspicious": isSuspiciousInput.toString(),
  //       },
  //       body: JSON.stringify(data),
  //     }).then((res) => res.json());

  //     console.log(result,"result");

  //     if (result?.success) {
  //       toast.success("successfully");
  //       router.push("/");
  //     } else {
  //       toast.error("something went wrong error occured");
  //     }
  //   } catch (error) {
  //     toast.error("something error while save your blog");
  //     console.log(error.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const onBlogSubmit = async (data) => {
    setIsLoading(true);
    try {
      const isSuspiciousInput = isSuspiciousContent(data);

      const result = await fetch("/api/create-blog-post", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "x-arcjet-suspicious": isSuspiciousInput.toString(),
        },
        body: JSON.stringify(data),
      }).then((res) => res.json());

     

      if (result.success) {
        toast(result.success);
        router.push("/");
      } else {
        toast(result.error);
      }
    } catch (e) {
      toast("Some error occured");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setQuillLoaded(true);
  }, []);

  const isBtnDisabled = () => {
    return (
      title === "" || category === "" || coverImage === "" || content === ""
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{user?.userName}</p>
          </div>
        </div>
        <Button
          onClick={handleSubmit(onBlogSubmit)}
          disabled={isBtnDisabled() || isLoading}
        >
          Publish
        </Button>
      </header>
      <main>
        <form>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                placeholder="Title"
                className="text-4xl font-bold border-none outline-none mb-4 p-0 focus-visible:ring-0"
              />
            )}
          />

          {errors.title && (
            <p className="text-sm text-red-600 mt-2">{errors.title.message}</p>
          )}

          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Category" />
                </SelectTrigger>
                <SelectContent>
                  {BLOG_CATEGORIES.map((categoryItem) => (
                    <SelectItem key={categoryItem.key} value={categoryItem.key}>
                      {categoryItem?.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          {/* i want to wacth here  */}
          <div className="flex items-center mb-6">
            <UploadButton
              content={{
                button: (
                  <div className="flex gap-3">
                    <PlusCircle className="h-4 w-4 text-white" />
                    <span className="text-[13px]">Add Cover Image</span>
                  </div>
                ),
              }}
              appearance={{
                allowedContent: {
                  display: "none",
                },
                utButton: {
                  base: "py-2 px-2 rounded-lg transition-all duration-300", // Base styles
                  hover: "hover:bg-black/90", // Hover state
                  uploading: "bg-accent text-white", // While uploading
                  ready: "bg-primary text-white", // Ready state
                  readying: "bg-muted text-gray-500", // Preparing state
                },
              }}
              className="mt-4 ut-button:bg-black ut-button:hover:bg-black/90 ut-button:ut-uploading:bg-accent ut-button:ut-ready:bg-primary ut-button:ut-readying:bg-muted ut-button:py-2 ut-button:px-2 ut-button:rounded-lg ut-button:transition-all ut-button:duration-300"
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                if (res && res[0]) {
                  setValue("coverImage", res[0].ufsUrl);
                  toast.success("Image uploaded successfully");
                }
              }}
              onUploadError={(error) => {
                toast.error("Image upload failed");
                console.log(error.message);
              }}
            />
          </div>

          {quillLoaded && (
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  modules={modules}
                  {...field}
                  onChange={(content) => field.onChange(content)}
                  placeholder="Write your story"
                  className="quill-editor"
                />
              )}
            />
          )}
        </form>
      </main>
    </div>
  );
};

export default CreateBlogForm;
