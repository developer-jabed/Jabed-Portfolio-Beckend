// enums.ts
export enum ROLE {
    USER = "User",
    ADMIN = "Admin",
}

export enum STATUS {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED",
}



export interface IUser {
    id: number;
    name?: string | null;
    email: string;
    password: string;
    role: ROLE;
    picture?: string | null;
    phone?: string | null;
    status: STATUS;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserCreateInput {
    name?: string;
    email: string;
    password: string;
    role?: ROLE;
    picture?: string;
    phone?: string;
    status?: STATUS;
    isVerified?: boolean;
}

export interface IUserUpdateInput {
    name?: string;
    email?: string;
    password?: string;
    role?: ROLE;
    picture?: string;
    phone?: string;
    status?: STATUS;
    isVerified?: boolean;
}
