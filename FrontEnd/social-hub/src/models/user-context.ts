
export class UserContext {
    
    constructor(userId: number | null)
    {
        this.userId = userId;
    }
    public userId: number | null;
}