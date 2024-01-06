import { useContext, useState } from "react"
import PostColumns from "./post-columns";
import PostsContext from "@/context/posts-context";
import Header from "./header";
import ProfilePage from "./profile-page";
import PostModal from "./modals/post-modal";
import RegisterModal from "./modals/register-modal";
import LoginModal from "./modals/login-modal";

export enum DisplayPage {
    Posts,
    User
}

export default function Dashboard() {
    const [filterId, setFilterId] = useState(0);
    const [displayPage, setDisplayPage] = useState(DisplayPage.Posts)

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
        if (id === 0) {
            setDisplayPage(DisplayPage.Posts)
        }
    }

    const pageRouting = () => {
        switch(displayPage) {
            case DisplayPage.Posts:
                return(<PostColumns posts={getDisplayPosts()} viewFrom={viewFrom}></PostColumns>)
            case DisplayPage.User:
                return(<ProfilePage></ProfilePage>)
        }
    }

    return(
        <div>
            <LoginModal></LoginModal>
            <RegisterModal></RegisterModal>
            <PostModal></PostModal>
            <Header viewFrom={viewFrom} switchPage={setDisplayPage} displayPage={displayPage}></Header>
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
               {pageRouting()}
            </main>
            
        </div>
    )
}