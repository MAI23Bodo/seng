'use client';
import UserContext from "@/context/user-context";
import { Dispatch, SetStateAction, useContext } from "react";
import React from "react";
import { DisplayPage } from "./dashboard";
import { SearchBar } from "./searchbar";

interface HeaderProps {
  resetFilters: () => void;
  switchPage: (targetPage: DisplayPage) => void;
  displayPage: DisplayPage
  search: string | null
  setSearch: Dispatch<SetStateAction<string | null>>
}

export default function Header(props: HeaderProps) {

  const userContext = useContext(UserContext);

  if (!userContext) return <p>No user context available</p>;

  const { user, logout, editUser} = userContext;
  
  const onOpenLoginModel = () => {
    let modal: any =  document.getElementById('login-modal');
    modal.showModal()
  }

  const onOpenRegisterModel = () => {
    let modal: any =  document.getElementById('register-modal');
    modal.showModal()
  }

  const onOpenPostModal = () => {
    let modal: any =  document.getElementById('post-modal');
    modal.showModal()
  }

  const onUpdateUser = () => {
    if (user) {
      editUser(user)
    }
  }

  const onProfile = () => {
    props.switchPage(DisplayPage.User)
  }

  const [theme, setTheme] = React.useState('synthwave');
  const toggleTheme = () => {
    setTheme(theme === 'synthwave' ? 'cupcake' : 'synthwave');
  };
  // initially set the theme and "listen" for changes to apply them to the HTML tag
  React.useEffect(() => {
    document.querySelector('html')?.setAttribute('data-theme', theme);
  }, [theme]);



  const NewPostButton = () => {
    if (user && props.displayPage === DisplayPage.Posts) {
      return (
        <button className="btn btn-outline btn-primary" onClick={onOpenPostModal}>New Post</button>
      )
    }
    return (
      <div/>
    )
  }

  const UpdateButton = () => {
    if (user && props.displayPage === DisplayPage.User) {
      return (
        <button className="btn btn-outline btn-primary" onClick={onUpdateUser}>Update User</button>
      )
    }
    return (
      <div/>
    )
  }

  return(
    <div className="navbar bg-base-300">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl" onClick={() => {if (user !== null) {props.resetFilters()}}}>Social-Hub</a>
        <label className="swap swap-rotate">
          <input type="checkbox" className="theme-controller" onClick={toggleTheme} />
          <svg className="swap-on fill-current w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/></svg>
          <svg className="swap-off fill-current w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/></svg>
        </label>
      </div>
      <div className="flex-none gap-2">
        {
          NewPostButton()
        }
        {
          SearchBar({search: props.search, setSearch: props.setSearch})
        }
        {
          UpdateButton()
        }
        {
          user != null
          ? <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img alt={user.username} src={user.userIconUrl?? ''} />
              </div>
            </label>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              {
                /*
                <li>
                <a className="justify-between" onClick={onProfile}>
                  Profile
                </a>
              </li>
                */
              }
              <li><button onClick={() => {logout()}}>Logout</button></li>
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