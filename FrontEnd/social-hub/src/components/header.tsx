'use client';
import { User } from "@/models/user";
import LoginModal from "./login-modal";
import RegisterModal from "./register-modal";
import UserContext from "@/context/user-context";
import { useContext } from "react";

export default function Header() {

  const userContext = useContext(UserContext);

  if (!userContext) return <p>No user context available</p>;

  const { user, login, logout } = userContext;
  
  const onOpenLoginModel = () => {
    let modal: any =  document.getElementById('login-modal');
    modal.showModal()
  }

  const onOpenRegisterModel = () => {
    let modal: any =  document.getElementById('register-modal');
    modal.showModal()
  }

  return(
    <div className="navbar bg-base-100">
      <LoginModal></LoginModal>
      <RegisterModal></RegisterModal>
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">Social-Hub</a>
      </div>
      <div className="flex-none gap-2">
        <div className="form-control">
          <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
        </div>
        {
          user != null
          ? <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img alt={user.username} src={user.userIconUrl?? ''} />
              </div>
            </label>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li>
                <a className="justify-between">
                  Profile
                </a>
              </li>
              <li><button onClick={() => {console.debug('onClick'); logout()}}>Logout</button></li>
            </ul>
            </div>
          :
            <div className="navbar-end">
                <button className="btn mr-2 btn-outline btn-primary" onClick={onOpenLoginModel}>
                  Login
                </button>
                <button className="btn btn-outline btn-secondary" onClick={onOpenRegisterModel}>
                  Register
                </button>
            </div>
        }
      </div>
    </div>
  )
}