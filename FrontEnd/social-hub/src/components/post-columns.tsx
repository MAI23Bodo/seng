import { Post } from "@/models/post";
import PostCard from "./post-card";

interface PostColumnsProps {
  posts: Post[];
  viewFrom: (userId: number) => void;
}
export default function PostColumns(props: PostColumnsProps) {
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