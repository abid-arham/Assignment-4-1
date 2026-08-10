import { Role } from "@prisma/client";


export interface ILoginUser{
    email: string;
    password: string;
}


export interface ICreateUser{
    name: string,
    email: string,
    password: string,
    role: Role
}

