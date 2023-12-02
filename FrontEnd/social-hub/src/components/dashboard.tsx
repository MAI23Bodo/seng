import { useContext, useEffect, useState } from "react"
import {Post} from '../models/post';
import PostColumns from "./post-columns";
import PostsContext from "@/context/posts-context";

interface DashboardProps {
    mode: string
}

export default function Dashboard(props: DashboardProps) {
    const [displayPosts, setDisplayPosts] = useState<Post[]>([])
    const postsContext = useContext(PostsContext);
    if (!postsContext) return <p>No posts context available</p>;
    
    useEffect(() => {
        switch(props.mode) {
            case 'all_posts':
                setDisplayPosts(postsContext.posts)
            break
        }
    })
    

    return(
        <PostColumns posts={displayPosts}></PostColumns>
    )
}