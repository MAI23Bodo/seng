import UserContext from "@/context/user-context";
import { User } from "@/models/user";
import React, { useContext, useEffect, useState } from 'react';

export default function LoginModal() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [validForm, setValidForm] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')

    const userContext = useContext(UserContext);

    if (!userContext) return <p>No user context available</p>;

    const { login } = userContext;
    
    const onSubmit = () => {
        login({username: username, password: password})
        .then(res => {
            if (res) {
                let modal: any =  document.getElementById('login-modal');
                setErrorMessage('')
                modal!.close()
            }
            else {
                setErrorMessage('invalid username or password')
            }
        })
    }

    const formValidation = () => {
      return username === '' || password === '';
    }

    useEffect(() => {
        setValidForm(formValidation())
    })


    return(
        <dialog id="login-modal" className="modal">
            <div className="modal-box">
                <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold text-lg">Login</h3>
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
                            <span className="label-text">Username</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Type here"
                            className="input input-bordered input-primary w-full"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="form-control w-full max-w">
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input
                            type="password"
                            placeholder="Type here"
                            className="input input-bordered input-primary w-full"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button className="btn  btn-primary mt-2" type="button" onClick={onSubmit} disabled={validForm}>Submit</button>
                </form>
            </div>
        </dialog>
    )
}