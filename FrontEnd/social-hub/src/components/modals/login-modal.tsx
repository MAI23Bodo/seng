import UserContext from "@/context/user-context";
import React, { useContext, useState } from 'react';

export default function LoginModal() {

  
    const [username, setUsername] = useState({value: '', status: 'primary', error: ''});
    const [password, setPassword] = useState({value: '', status: 'primary', error: ''});

    const userContext = useContext(UserContext);

    if (!userContext) return <p>No user context available</p>;

    const { login } = userContext;


    const handleUsernameChange = (newValue: string) => {
        if (!newValue) {
            setUsername({value: newValue, status: 'error', error: 'username must be set'})
            return
        }
        setUsername({value: newValue, status: 'success', error: ''})
    }

    const handlePasswordChange = (newValue: string) => {
        if (newValue.length < 7) {
            setPassword({value: newValue, status: 'error', error: 'password must be longer then 6 characters'})
            return
        }
        setPassword({value: newValue, status: 'success', error: ''})
    }
    
    const onSubmit = () => {
        login({username: username.value, password: password.value})
        .then(res => {
            if (res) {
                let modal: any =  document.getElementById('login-modal');
                clearFields();
                modal!.close()
            }
            else {
                setPassword(prevValue => ({...prevValue, status: 'error', error: 'invalid username or password'}))
            }
        })
    }

    const clearFields = () => {
        setUsername({value: '', status: 'primary', error: ''})
        setPassword({value: '', status: 'primary', error: ''})
    }

    const submitReady = () => {
        return 'success' === username.status
            && 'success' === password.status
    }

    const getFormFieldClass = (status: string) => {
        return `input input-bordered input-${status} w-full max-w-x`
    }

    return(
        <dialog id="login-modal" className="modal">
            <input
                type="text"
                placeholder="Type here"
                className="input input-bordered input-error w-full max-w-x"
                hidden={true}
            />
             <input
                type="text"
                placeholder="Type here"
                className="input input-bordered input-success w-full max-w-x"
                hidden={true}
            />
            <div className="modal-box">
                <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold text-lg">Login</h3>
                <form method="post">
                <div className="form-control w-full max">
                        <label className="label">
                            <span className="label-text">Username</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Type here"
                            className={getFormFieldClass(username.status)}
                            value={username.value}
                            onChange={(e) => {handleUsernameChange(e.target.value)}}
                        />
                        <div className="label">
                            <span className="label-text text-error">{username.error}</span>
                        </div>
                    </div>
                    <div className="form-control w-full max-w">
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input
                            type="password"
                            placeholder="Type here"
                            className={getFormFieldClass(password.status)}
                            value={password.value}
                            onChange={(e) => {handlePasswordChange(e.target.value)}}
                        />
                        <div className="label">
                            <span className="label-text text-error">{password.error}</span>
                        </div>
                    </div>
                    <button className="btn  btn-primary mt-2" type="button" onClick={onSubmit} disabled={!submitReady()}>Submit</button>
                </form>
            </div>
        </dialog>
    )
}