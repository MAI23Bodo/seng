import PostsContext from "@/context/posts-context";
import UserContext from "@/context/user-context";
import { useContext, useEffect, useState } from "react";

export default function PostModal() {

    const [text, setText] = useState({value: '', status: 'primary', error: ''});
    const [image, setImage] = useState<File | null>(null);

    const postsContext = useContext(PostsContext);
    const userContext = useContext(UserContext) 

    if (!postsContext) return <p>No posts context available</p>;
    if (!userContext) return <p>No user context available</p>;

    const { submitPost } = postsContext;
    const { user } = userContext;

    const handleTextChange = (newValue: string) => {
        if (!newValue) {
            setText({value: newValue, status: 'error', error: 'message must be set'})
            return
        }
        setText({value: newValue, status: 'success', error: ''})
    }

    const onSubmit = () => {
        submitPost({
            id: null, user: user!, text: text.value, image: null,
            timestamp: Date.now().toString()
        })
        let modal: any =  document.getElementById('post-modal');
        modal!.close()
    }

    const submitReady = () => {
        return 'success' === text.status
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImage(e.target.files[0]);
          }
    }

    const getFormFieldClass = (status: string) => {
        return `textarea textarea-${status}`
    }

    return(
        <dialog id="post-modal" className="modal">
            <div className="modal-box">
                <textarea
                    className={'textarea textarea-error'}
                    hidden={true}
                />
                <textarea
                    className={'textarea textarea-success'}
                    hidden={true}
                />
                <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold text-lg">New Post</h3>
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
                    <div className="form-control w-full max">
                        <label className="label">
                            <span className="label-text">Image</span>
                        </label>
                        <input
                            type="file"
                            className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                    </div>
                    <button className="btn  btn-primary mt-2" type="button" onClick={onSubmit} disabled = {!submitReady()}>Submit</button>
                </form>
            </div>
        </dialog>
    )
}