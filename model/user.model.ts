export interface User {
    email: string;
    password: string;
    name: string;
}

export interface Authorization {
    id: number;
    email: string;
    iat: number;
    exp: number;
    iss: string;
}
