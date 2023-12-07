import PostsContext from "@/context/posts-context";
import UserContext from "@/context/user-context";
import { useContext, useEffect, useState } from "react";

export default function PostModal() {

    const [text, setText] = useState('');
    const [errorMessage, setErrorMessage] = useState('')
    const [image, setImage] = useState<File | null>(null);

    const postsContext = useContext(PostsContext);
    const userContext = useContext(UserContext) 

    if (!postsContext) return <p>No posts context available</p>;
    if (!userContext) return <p>No user context available</p>;

    const { submitPost } = postsContext;
    const { user } = userContext;

    const formValidation = () => {
        if (!text) {
            return 'post requires a message'
        }
        if (!image) {
            return 'post requires an image'
        }
      return '';
    }

    const onSubmit = () => {
        submitPost({
            id: null, user: user!, text: text, image: null,
            timestamp: Date.now().toString()
        })
        let modal: any =  document.getElementById('post-modal');
        modal!.close()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImage(e.target.files[0]);
          }
    }

    useEffect(() => {
        setErrorMessage(formValidation())
    })


    return(
        <dialog id="post-modal" className="modal">
            <div className="modal-box">
                <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold text-lg">New Post</h3>
                {
                    errorMessage !== '' &&
                    (
                        <div role="alert" className="alert alert-error mt-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{errorMessage}</span>
                        </div>
                    )
                }
                <form method="post">
                    <div className="form-control w-full max">
                        <label className="label">
                            <span className="label-text">Message</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Type here"
                            className="input input-bordered input-primary w-full"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>
                    <div className="form-control w-full max">
                        <label className="label">
                            <span className="label-text">Image</span>
                        </label>
                        <input type="file"
                            className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                            onChange={handleFileChange}/>
                    </div>
                    <button className="btn  btn-primary mt-2" type="button" onClick={onSubmit} disabled = {errorMessage !== ''}>Submit</button>
                </form>
            </div>
        </dialog>
    )
}