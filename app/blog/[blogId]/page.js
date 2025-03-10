import { getBlogPostIdAction } from "@/actions/blog";
import BlogDetails from "@/app/components/blog/BlogDeatils";
import { notFound } from "next/navigation";
import { Suspense } from "react";

function Fallback() {
  return <div>Loading...</div>;
}

export default async function BlogDetailsPage({ params }) {
  const { blogId } = await params;
  const data = await getBlogPostIdAction(blogId);

  if (data.error) {
    notFound();
  }

  const { post } = data;
  return (
    <Suspense fallback={<Fallback />}>
      <BlogDetails post={JSON.parse(post)} />
    </Suspense>
  );
}
