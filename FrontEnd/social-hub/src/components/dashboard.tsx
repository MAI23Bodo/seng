import { useContext, useEffect, useState } from "react"
import PostColumns from "./post-columns";
import PostsContext from "@/context/posts-context";
import Header from "./header";

export default function Dashboard() {
    const [filterId, setFilterId] = useState(0);
    const postsContext = useContext(PostsContext);
    if (!postsContext) return <p>No posts context available</p>;
    
    const getDisplayPosts = () => {
        if (filterId === 0) {
            return postsContext.posts
        }
        return postsContext.posts.filter(p => p.user.id === filterId);
    }
    
    const viewFrom = (id: number) => {
        setFilterId(id)
    }

    return(
        <div>
            <Header viewFrom={viewFrom}></Header>
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <PostColumns posts={getDisplayPosts()} viewFrom={viewFrom}></PostColumns>
            </main>
        </div>
    )
}