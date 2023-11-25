import { User } from "./user";

export class Post {
    constructor(id: number,
        text: string | null,
        image: string | null,
        timestamp: string | null,
        user: User) {
        this.id = id;
        this.text = text;
        this.image = image;
        this.timestamp = timestamp;
        this.user = user;
    }
    
    public id: number;
    public text: string | null;
    public image: string | null;
    public timestamp: string | null;
    public user: User;
}