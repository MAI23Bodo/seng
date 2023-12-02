import React, { useState, ReactNode } from 'react';
import UserContext from './user-context';
import {UserContextType} from './user-context';

interface PostsProviderProps {
  children: ReactNode;
}

const PostsProvider: React.FC<PostsProviderProps> = ({ children }) => {
    const [posts, setPosts] = useState<UserContextType['user']>(null);

    const login = (userName: string) => {
        setUser({ username: userName, email: 'a', id: 0, first_name: '', last_name: '', userIconUrl: ''});
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
