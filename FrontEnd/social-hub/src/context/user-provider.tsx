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
        return localStorage.getItem(tokenStorageKey)
    }

    const try_finding_user = () => {
        let foundValue = localStorage.getItem(userStorageKey)
        return foundValue != null ? JSON.parse(foundValue) : null
    }

    const [user, setUser] = useState<UserContextType['user']>(try_finding_user());
    const [token, setToken] = useState<UserContextType['token']>(try_finding_token());
    const {createUser, postLogin}= useRequests();
    

   


    const login = (credentials: Credentials) => {
        return postLogin(credentials).then(result => {
            if (result.userId) {
                setUser({ username: credentials.username, email: '', id: result.userId, first_name: '', last_name: '', userIconUrl: ''})
                setToken(`Token ${result.token}`)
                localStorage.setItem(tokenStorageKey, result.token)
                localStorage.setItem(userStorageKey, JSON.stringify({id: result.userId, username: credentials.username}))
                return true
            }
            else {
                return false
            }
        })
    };

    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem(tokenStorageKey)
        localStorage.removeItem(userStorageKey)
    };

    const register = (credentials: Credentials) => {
        return createUser(credentials).then(repsonse => {
            setUser(repsonse)
            return true
        })
        
    }

    return (
        <UserContext.Provider value={{ user, token, login, logout, register}}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
