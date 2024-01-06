import UserContext from "@/context/user-context";
import { Credentials } from "@/models/credentials";
import { useContext, useState } from "react";

export default function RegisterModal() {

    const [username, setUsername] = useState({value: '', status: 'primary', error: ''});
    const [password, setPassword] = useState({value: '', status: 'primary', error: ''});
    const [repeatPassword, setRepeatPassword] = useState({value: '', status: 'primary', error: ''});

    const userContext = useContext(UserContext);

    if (!userContext) return <p>No user context available</p>;

    const { register } = userContext;

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
        if (newValue != repeatPassword.value) {
            setRepeatPassword(prevValue => ({...prevValue, status: 'error', error: 'password and repeat password do not match'}))
        }
        setPassword({value: newValue, status: 'success', error: ''})
    }

    const handlePasswordRepeatChange =  (newValue: string) => {
        if (password.value != newValue) {
            setRepeatPassword({value: newValue, status: 'error', error: 'password and repeat password do not match'})
            return
        }
        setRepeatPassword({value: newValue, status: 'success', error: ''})
    }

    const submitReady = () => {
        return 'success' === username.status
            && 'success' === password.status
            && 'success' === repeatPassword.status
    }

    
    const onSubmit = () => {
        let credentials: Credentials = {username: username.value, password:  password.value}
        register(credentials).then(res => {
            if (res) {
                let modal: any =  document.getElementById('register-modal');
                modal!.close();
                clearFields();
            }
        })
    }

    const getFormFieldClass = (status: string) => {
        return `input input-bordered input-${status} w-full max-w-x`
    }

    const clearFields = () => {
        setUsername({value: '', status: 'primary', error: ''})
        setPassword({value: '', status: 'primary', error: ''})
        setRepeatPassword({value: '', status: 'primary', error: ''})
    }


    return(
        <dialog id="register-modal" className="modal">
            <div className="modal-box">
                <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold text-lg">Register</h3>
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
                    <div className="form-control w-full max-w">
                        <label className="label">
                            <span className="label-text">Repeat Password</span>
                        </label>
                        <input
                            type="password"
                            placeholder="Type here"
                            className={getFormFieldClass(repeatPassword.status)}
                            value={repeatPassword.value}
                            onChange={(e) => {handlePasswordRepeatChange(e.target.value)}}
                        />
                        <div className="label">
                            <span className="label-text text-error">{repeatPassword.error}</span>
                        </div>
                    </div>
                    <button className="btn  btn-primary mt-2" type="button" onClick={onSubmit} disabled = {!submitReady()}>Submit</button>
                </form>
            </div>
        </dialog>
    )
}