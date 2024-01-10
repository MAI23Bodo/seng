import PostsContext from "@/context/posts-context";
import UserContext from "@/context/user-context";
import { useContext, useState } from "react";

export interface UpdatePostModalProps {
    id: string;
    postText: string;
}

export default function UpdatePostModal(props: UpdatePostModalProps) {

    const [text, setText] = useState({value: props.postText, status: 'primary', error: ''});

    const postsContext = useContext(PostsContext);
    const userContext = useContext(UserContext) 

    if (!postsContext) return <p>No posts context available</p>;
    if (!userContext) return <p>No user context available</p>;

    const { changePost } = postsContext;

    const handleTextChange = (newValue: string) => {
        if (!newValue) {
            setText({value: newValue, status: 'error', error: 'message must be set'})
            return
        }
        setText({value: newValue, status: 'success', error: ''})
    }

    const onSubmit = () => {
        changePost(props.id, text.value)
        let modal: any =  document.getElementById(`post-update-modal-${props.id}`);
        modal!.close()
    }

    const submitReady = () => {
        return 'success' === text.status
    }

    const getFormFieldClass = (status: string) => {
        return `textarea textarea-${status}`
    }

    return(
        <dialog id={`post-update-modal-${props.id}`} className="modal">
            <div className="modal-box">
                <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold text-lg">Update Post</h3>
                <form method="post">
                    <div className="form-control w-full max">
                        <label className="label">
                            <span className="label-text">Message</span>
                        </label>
                        <textarea
                            placeholder="Type here"
                            className={getFormFieldClass(text.status)}
                            value={text.value}
                            onChange={(e) => {handleTextChange(e.target.value)}}
                        />
                        <div className="label">
                            <span className="label-text text-error">{text.error}</span>
                        </div>
                    </div>
                    <button className="btn  btn-primary mt-2" type="button" onClick={onSubmit} disabled = {!submitReady()}>Submit</button>
                </form>
            </div>
        </dialog>
    )
}