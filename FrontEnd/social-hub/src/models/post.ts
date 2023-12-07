import { User } from "./user";

export interface Post {
    id: number | null;
    text: string | null;
    image: string | null;
    timestamp: string | null;
    user: User;
}