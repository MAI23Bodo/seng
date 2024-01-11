import UserContext from "@/context/user-context";
import { User } from "@/models/user";
import { useContext, useState } from "react";

export interface UserModalProps {
    id: string
    user: User
}

export const UserModal = (props: UserModalProps) => {

    const userContext = useContext(UserContext);

    if (!userContext) return <p>No user context available</p>;

    const { user } = userContext;

    
    return (
        <dialog id={`user-modal-${props.id}`} className="modal">
            <div className="modal-box">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold text-lg">{props.user.username}</h3>
                <form method="post" className="card-body">
                        <div className="form-control w-full max">
                            <label className="label">
                                <span className="label-text">E-Mail</span>
                            </label>
                            <input
                                type="email"
                                placeholder="Type here"
                                className="input input-bordered input-primary w-full"
                                value={user?.email ?? ''}
                                readOnly = {true}
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
                                readOnly = {true}
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
                                readOnly = {true}
                            />
                        </div>
                    </form>
            </div>
        </dialog>
    )
}