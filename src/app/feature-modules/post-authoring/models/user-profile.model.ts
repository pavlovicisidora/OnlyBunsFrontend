import { Role } from "./role";

export interface UserProfile{
    id:number;
    username:string;
    firstName: string;
    lastName: string;
    email: string;
    postCount: number;
    role: Role;
    followersCount: number;
  }
  