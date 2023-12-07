import PostsContext from "@/context/posts-context";
import UserContext from "@/context/user-context";
import { Post } from "@/models/post";
import { useContext } from "react";

interface PostCardProps {
    post: Post;
    viewFrom: (userId: number) => void;
}

export default function PostCard(props: PostCardProps) {


    const userContext = useContext(UserContext);
    const postsContext = useContext(PostsContext);

    if (!userContext) return <p>No user context available</p>;
    if (!postsContext) return <p>No user context available</p>;

    const { user } = userContext;
    const {removePost} = postsContext;

    const onDeletePost = (postId: number) => {
        console.debug(postsContext)
        removePost(postId)
    }

    return(
    <div className="card card-compact w-96 bg-base-100 shadow-xl mb-5 break-after-column post">
        <figure><img src={props.post.image ?? ''} alt="" /></figure>
        <div className="card-body">
            <h2 className="card-title"><button onClick={() => {props.viewFrom(props.post.user.id)}}><u>{props.post.user.username}</u></button></h2>
            <p>{props.post.text}</p>
            {
                props.post.user.id === user?.id &&
                (<div className="card-actions justify-end">
                <button className="btn btn-circle btn-outline btn-error" onClick={() => {onDeletePost(props.post.id!)}}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <button className="btn btn-circle btn-outline   btn-accent">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.186 2.09c.521.25 1.136.612 1.625 1.101.49.49.852 1.104 1.1 1.625.313.654.11 1.408-.401 1.92l-7.214 7.213c-.31.31-.688.541-1.105.675l-4.222 1.353a.75.75 0 0 1-.943-.944l1.353-4.221a2.75 2.75 0 0 1 .674-1.105l7.214-7.214c.512-.512 1.266-.714 1.92-.402zm.211 2.516a3.608 3.608 0 0 0-.828-.586l-6.994 6.994a1.002 1.002 0 0 0-.178.241L9.9 14.102l2.846-1.496c.09-.047.171-.107.242-.178l6.994-6.994a3.61 3.61 0 0 0-.586-.828zM4.999 5.5A.5.5 0 0 1 5.47 5l5.53.005a1 1 0 0 0 0-2L5.5 3A2.5 2.5 0 0 0 3 5.5v12.577c0 .76.082 1.185.319 1.627.224.419.558.754.977.978.442.236.866.318 1.627.318h12.154c.76 0 1.185-.082 1.627-.318.42-.224.754-.559.978-.978.236-.442.318-.866.318-1.627V13a1 1 0 1 0-2 0v5.077c0 .459-.021.571-.082.684a.364.364 0 0 1-.157.157c-.113.06-.225.082-.684.082H5.923c-.459 0-.57-.022-.684-.082a.363.363 0 0 1-.157-.157c-.06-.113-.082-.225-.082-.684V5.5z" /></svg>
                </button>
            </div>)
            }
            
        </div>
    </div>
    )
}