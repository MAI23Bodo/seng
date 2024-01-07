import { User } from "./user";

export interface Post {
    id: number | null;
    text: string | null;
    image: string | null;
    preview_image: string | null;
    timestamp: string | null;
    emotion: string | null;
    user: User;
}