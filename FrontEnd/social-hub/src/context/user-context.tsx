import { User } from '@/models/user';
import React from 'react';

const UserContext = React.createContext<UserContextType | null>(null);

export default UserContext;

export interface UserContextType {
    user: User | null;
    login: (userName: string) => void;
    logout: () => void;
}