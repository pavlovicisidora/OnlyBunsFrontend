import { Location } from "./location.model";

export interface Registration {
    id:number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    location:Location;
    isActivated: boolean;
}