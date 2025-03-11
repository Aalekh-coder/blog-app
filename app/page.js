import HomeComponents from "./components/home";
import {getBlogPostsAction} from "@/actions/blog"

export default async function Home() {
  const {posts} = await getBlogPostsAction();
console.log(posts)

  return (
    <HomeComponents posts={posts} />
  );
}
