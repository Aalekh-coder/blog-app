import HomeComponents from "./components/home";
import {getBlogPostsAction} from "@/actions/blog"

export default async function Home() {
  const {posts} = await getBlogPostsAction();


  return (
    <HomeComponents posts={posts} />
  );
}
