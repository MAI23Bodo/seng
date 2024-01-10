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
    const [search, setSearch] = useState<string | null>(null)
    const [displayPage, setDisplayPage] = useState(DisplayPage.Posts)
    

    const postsContext = useContext(PostsContext);
    if (!postsContext) return <p>No posts context available</p>
    
    const getDisplayPosts = () => {
        let result  = postsContext.posts
        if (filterId !== 0) {
            result =  postsContext.posts.filter(p => p.user.id === filterId)
        }        
        if (search !== null) {
            result = result.filter(p => p.text?.includes(search))
        }
        return result
    }

    const resetFilters = () => {
        setFilterId(0)
        setSearch(null)
        setDisplayPage(DisplayPage.Posts)
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
            <Header resetFilters={resetFilters} switchPage={setDisplayPage} displayPage={displayPage} search={search} setSearch={setSearch}></Header>
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
               {pageRouting()}
            </main>
            
        </div>
    )
}