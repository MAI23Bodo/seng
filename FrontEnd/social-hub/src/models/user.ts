export class User {
    constructor(username: string, userIconUrl: string) {
        this.username = username;
        this.userIconUrl = userIconUrl;
    }

    public username: string;
    public userIconUrl: string;
}