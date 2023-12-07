import UserContext from "@/context/user-context";
import { User } from "@/models/user";
import { useContext, useEffect, useState } from "react";

export default function RegisterModal() {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');

    const userContext = useContext(UserContext);

    if (!userContext) return <p>No user context available</p>;

    const { register } = userContext;

    const formValidation = () => {
        if (username === '') {
            return 'Username must be set';
        }
        if (email === '') {
            return 'Email must be set';
        }
        if (!/\S+@\S+\.\S+/.test(email))
        {
            return 'Invalid Email'
        }
        if (firstname === ''){
            return 'Firstname must be set'
        }
        if (lastname === '') {
            return 'Lastname must be set'
        }
        if (password !== repeatPassword) {
            return 'Password and Repeat Password do not match';
        }
        if (password.length < 7) {
            return 'Password must be longer then 6 characters';
        }
        return '';
    }

    useEffect(() => {
        setErrorMessage(formValidation())
    })

    
    const onSubmit = () => {
        let user: User = {id: 0, username: username, userIconUrl: null, first_name: firstname, last_name: lastname, email: email}
        register(user).then(res => {
            if (res) {
                let modal: any =  document.getElementById('register-modal');
                setErrorMessage('')
                modal!.close()
            }
        })
    }


    return(
        <dialog id="register-modal" className="modal">
            <div className="modal-box">
                <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold text-lg">Register</h3>
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
                    <div className="form-control w-full max">
                        <label className="label">
                            <span className="label-text">E-Mail</span>
                        </label>
                        <input
                            type="email"
                            placeholder="Type here"
                            className="input input-bordered input-primary w-full"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-control w-full max">
                        <label className="label">
                            <span className="label-text">First Name</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Type here"
                            className="input input-bordered input-primary w-full"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                        />
                    </div>
                    <div className="form-control w-full max">
                        <label className="label">
                            <span className="label-text">Last Name</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Type here"
                            className="input input-bordered input-primary w-full"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
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
                    <div className="form-control w-full max-w">
                        <label className="label">
                            <span className="label-text">Repeat Password</span>
                        </label>
                        <input
                            type="password"
                            placeholder="Type here"
                            className="input input-bordered input-primary w-full"
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                        />
                    </div>
                    <button className="btn  btn-primary mt-2" type="button" onClick={onSubmit} disabled = {errorMessage !== ''}>Submit</button>
                </form>
            </div>
        </dialog>
    )
}