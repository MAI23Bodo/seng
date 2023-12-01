import { Post } from "@/models/post";
import PostCard from "./post-card";

export default function Dashboard(props: {posts: Post[]}) {
  return(
    <div className="columns-3 ">
      {
        
        props.posts.map((p) => {
          return (<PostCard post={p} key={p.id}></PostCard>)
        })
      }
    </div>
  )
}