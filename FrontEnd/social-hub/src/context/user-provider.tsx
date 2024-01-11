import React, { useState, ReactNode } from 'react';
import UserContext from './user-context';
import {UserContextType} from './user-context';
import { User } from '@/models/user';
import { useRequests } from '@/requests/requests';
import { Credentials } from '@/models/credentials';

interface UserProviderProps {
  children: ReactNode;
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const tokenStorageKey = 'social_hub_token'
    const userStorageKey = 'social_hub_user'

    const try_finding_token = () => {
        console.debug(localStorage.getItem(tokenStorageKey))
        return localStorage.getItem(tokenStorageKey)
    }

    const try_finding_user = () => {
        let foundValue = localStorage.getItem(userStorageKey)
        console.debug(localStorage.getItem(userStorageKey))
        return foundValue != null ? JSON.parse(foundValue) : null
    }

    const [user, setUser] = useState<UserContextType['user']>(try_finding_user());
    const [token, setToken] = useState<UserContextType['token']>(try_finding_token());
    const {createUser, postLogin, logoutPost, updateUser, getUser}= useRequests();
    

   


    const login = (credentials: Credentials) => {
        return postLogin(credentials).then(result => {
            if (result.userId) {
                findUser(result.userId)
                let userObject = { username: credentials.username, email: null, id: result.userId, first_name: null, last_name: null, userIconUrl: '', password: null}
                setUser(userObject)
                setToken(`Token ${result.token}`)
                localStorage.setItem(tokenStorageKey, result.token)
                localStorage.setItem(userStorageKey, JSON.stringify(userObject))
                console.debug(JSON.stringify(userObject))
                return true
            }
            else {
                return false
            }
        })
    };

    const logout = () => {
        if (token == null) {
            console.warn('missing token')
            return
        }
        setUser(null)
        setToken(null)
        localStorage.removeItem(tokenStorageKey)
        localStorage.removeItem(userStorageKey)
        logoutPost(token)
    };

    const register = (credentials: Credentials) => {
        return createUser(credentials).then(result => {
            if (result.userId) {
                setUser({ username: credentials.username, email: null, id: result.userId, first_name: null, last_name: null, userIconUrl: '', password: null})
                setToken(`Token ${result.token}`)
                localStorage.setItem(tokenStorageKey, result.token)
                localStorage.setItem(userStorageKey, JSON.stringify({id: result.userId, username: credentials.username}))
                findUser(result.userId)
                return true
            }
            else {
                return false
            }
        })
    }

    const editUser = (user: User) => {
        if (token === null) {
            console.warn('missing token')
            return
        }
        return updateUser(user, token).then(result => {
            
        })
    }

    const findUser = (userId: number) =>  {
        if (token === null) {
            console.warn('missing token')
            return
        }
        getUser(userId, token).then(res => {
            setUser(res)
        })
    }

    return (
        <UserContext.Provider value={{ user, setUser, token, login, logout, register, editUser, findUser}}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
