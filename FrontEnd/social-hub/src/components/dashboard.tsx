import { Post } from "@/models/post";
import PostCard from "./post-card";
import { UserContext } from "@/models/user-context";
export default function Dashboard(props: {posts: Post[], userContext: UserContext}) {
  console.debug(props.posts)
  return(
    <div className="columns-3 ">
      {
        
        props.posts.map((p) => {
          return (<PostCard post={p} userContext={props.userContext} ></PostCard>)
        })
      }
    </div>
  )
}