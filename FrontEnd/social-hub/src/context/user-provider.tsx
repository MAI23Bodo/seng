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
    const [user, setUser] = useState<UserContextType['user']>(null);
    const {createUser, postLogin}= useRequests();

    const login = (credentials: Credentials) => {
        return postLogin(credentials).then(result => {
            if (result.userId) {
                setUser({ username: credentials.username, email: '', id: result.userId, first_name: '', last_name: '', userIconUrl: ''});
                return true
            }
            else {
                return false
            }
        })
    };

    const logout = () => {
        setUser(null);
    };

    const register = (credentials: Credentials) => {
        return createUser(credentials).then(repsonse => {
            setUser(repsonse)
            return true;
        })
        
    }

    return (
        <UserContext.Provider value={{ user, login, logout, register}}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
