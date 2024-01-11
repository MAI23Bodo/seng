import { Post } from "@/models/post";
import PostCard from "./post-card";
import { useContext, useEffect } from "react";
import UserContext from "@/context/user-context";
import PostsContext from "@/context/posts-context";

interface PostColumnsProps {
  posts: Post[];
  viewFrom: (userId: number) => void;
}
export default function PostColumns(props: PostColumnsProps) {

  const userContext = useContext(UserContext);
  const postsContext = useContext(PostsContext);

  if (!userContext) return <p>No user context available</p>;
  if (!postsContext) return <p>No user context available</p>;

  // const { user } = userContext;
  const {collectPosts} = postsContext;

  useEffect(() => {
    collectPosts()
  })

  return(
    <div className="columns-3 ">
      {
        props.posts.map((p) => {
          return (<PostCard post={p} viewFrom={props.viewFrom} key={p.id}></PostCard>)
        })
      }
    </div>
  )
}