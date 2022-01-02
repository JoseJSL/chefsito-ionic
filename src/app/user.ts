export interface User {
    username: string;
    firstName: string;
    lastName: string;
    imgURL: string;
    email: string;
    joinDate: Date;
}

export const defaultUser: User = {username: 'Chefsito', firstName: '', lastName: '', imgURL: 'assets/user-default.png', email: '', joinDate: new Date()};
