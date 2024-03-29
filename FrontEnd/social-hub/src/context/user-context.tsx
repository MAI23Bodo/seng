import { Credentials } from '@/models/credentials';
import { User } from '@/models/user';
import React from 'react';

const UserContext = React.createContext<UserContextType | null>(null);

export default UserContext;

export interface UserContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>
    token: string | null
    register: (user: Credentials) => Promise<boolean>;
    login: (credentials: Credentials) => Promise<boolean>;
    logout: () => void;
    editUser: (user: User) => void
    findUser: (userId: number) => void
}