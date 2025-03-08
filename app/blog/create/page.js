import CreateBlogForm from "@/app/components/blog/CreateBlog";
import { verifyAuth } from "@/lib/auth";
import { cookies } from "next/headers";

export default async function CreateBlogPage() {
  const cookiesInstance = await cookies();
  const token = cookiesInstance.get("token")?.value;
  const user = await verifyAuth(token);

  return <CreateBlogForm user={user} />;
}
