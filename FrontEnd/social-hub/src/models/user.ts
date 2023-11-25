export class User {
    constructor(id: number,
        username: string,
        userIconUrl: string | null,
        first_name: string | null,
        last_name: string | null,
        email: string | null) {
        this.id = id;
        this.username = username;
        this.userIconUrl = userIconUrl;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
    }

    public id: number;
    public username: string;
    public userIconUrl: string | null;
    public first_name: string | null;
    public last_name: string | null;
    public email: string | null;
}