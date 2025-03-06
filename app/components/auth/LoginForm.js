"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, RectangleEllipsis, User } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUserAction } from "@/actions/login";


const schema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

function LoginForm() {

  const router = useRouter();

      const [isLoading, setIsLoading] = useState(false);
      const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm({
        resolver: zodResolver(schema),
      });
    
  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => formData.append(key, data[key]));
      const result = await loginUserAction(formData)
      if (result.success) {
        toast.success("Login successful");
        router.push("/")
      } else {
        throw new Error(result.error || "Something wrong occured")
      }


    } catch (error) {
      console.log(error);
      toast.error("Login Failed")

    } finally {
      setIsLoading(false)
    }
      

    }
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
        
          <div className="relative">
            <Mail className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
            <Input
              type="email"
              {...register("email")}
              placeholder="Email"
              disabled={isLoading}
              className="pl-10 bg-gray-50 border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <div className="relative">
            <RectangleEllipsis className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
            <Input
              type="password"
              {...register("password")}
              placeholder="Password"
              disabled={isLoading}
              className="pl-10 bg-gray-50 border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="mt-3 w-full hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Register
        </Button>
        <Toaster position="top-center" />
      </form>
    )
}

export default LoginForm;