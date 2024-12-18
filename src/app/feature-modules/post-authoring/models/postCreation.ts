import { Time } from "@angular/common";
import { Location } from "../../authentication/model/location.model";
import { RegisteredUser } from "../../administrator/models/registered-user";

export interface PostCreation {
    user: RegisteredUser,
    description: string,
    image: string,
    location: Location,
    timeOfPublishing: Date,
    isDeleted: boolean
  }
  