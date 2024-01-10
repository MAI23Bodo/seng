import UserContext from "@/context/user-context";
import { User } from "@/models/user";
import { useContext, useState } from "react";

export default function ProfilePage() {

    const userContext = useContext(UserContext);

    if (!userContext) return <p>No user context available</p>;

    const { user } = userContext;

    const [username, setUsername] = useState(user?.username);
    const [email, setEmail] = useState(user?.email);
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [firstname, setFirstname] = useState(user?.first_name);
    const [lastname, setLastname] = useState(user?.last_name);

    const onSubmit = () => {

    }
    return (
        <div className="hero ">
            <div className="hero-content flex-col lg:flex-row">
                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-300">
                    <form method="post" className="card-body">
                        <h2 className="card-title">My Image</h2>
                        <div className="avatar">
                            <div className="w-24 mask mask-hexagon">
                                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                            </div>
                        </div>
                        <input type="file" className="file-input w-full max-w-xs" ></input>
                    </form>
                </div>
                <div>
                    <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-300">
                        <form method="post" className="card-body">
                            <h2 className="card-title">Authentication</h2>
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
                        </form>
                    </div>
                </div>
                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-300">
                    <form method="post" className="card-body">
                        <h2 className="card-title">About Me</h2>
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
                    </form>
                </div>
            </div>
        </div>
    )
}