import { Time } from "@angular/common";
import { Location } from "../../authentication/model/location.model";
import { UserProfile } from "./user-profile.model";

export interface PostCreation {
    user: UserProfile,
    description: string,
    image: string,
    location: Location,
    timeOfPublishing: Date,
    isDelted: boolean
  }
  