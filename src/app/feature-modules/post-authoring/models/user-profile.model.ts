import { Role } from "./role";
import { Location } from "../../authentication/model/location.model";
export interface UserProfile{
    id:number;
    username:string;
    firstName: string;
    lastName: string;
    email: string;
    postCount: number;
    role: Role;
    location: Location;
    followersCount: number;
  }
  