import UserContext from "@/context/user-context";
import { User } from "@/models/user";
import { useContext, useEffect, useState } from "react";

export default function ProfilePage() {

    const userContext = useContext(UserContext);

    if (!userContext) return <p>No user context available</p>;

    const { user,  setUser, findUser} = userContext;

    // useEffect(() => {
    //     if (user?.id !== null && user?.id !== undefined)
    //     {
    //         findUser(user?.id)
    //     }
    //     
    // })

    const onUsernameChange = (username: string) => {
        setUser(user =>  {
            return {...user, username: username} as User
        })
    }

    const onPasswordChange = (password: string) => {
        setUser(user =>  {
            return {...user, password: password} as User
        })
    }

    const onEmailChange = (email: string) => {
        setUser(user =>  {
            return {...user, email: email} as User
        })
    }

    const onFirstnameChange = (firstname: string) => {
        setUser(user =>  {
            return {...user, first_name: firstname} as User
        })
    }

    const onLastnameChange = (lastname: string) => {
        setUser(user =>  {
            return {...user, last_name: lastname} as User
        })
    }
    

    return (
        <div className="hero ">
            <div className="hero-content flex-col lg:flex-row">
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
                                    value={user?.username}
                                    onChange={(e) => onUsernameChange(e.target.value)}
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
                                    value={user?.password ?? ''}
                                    onChange={(e) => onPasswordChange(e.target.value)}
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
                                    value={''}
                                    onChange={(e) => onPasswordChange(e.target.value)}
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
                                value={user?.email ?? ''}
                                onChange={(e) => onEmailChange(e.target.value)}
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
                                value={user?.first_name ?? ''}
                                onChange={(e) => onFirstnameChange(e.target.value)}
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
                                value={user?.last_name ?? ''}
                                onChange={(e) => onLastnameChange(e.target.value)}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}