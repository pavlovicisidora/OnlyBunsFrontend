import { Time } from "@angular/common";
import { Location } from "../../authentication/model/location.model";

export interface PostCreation {
    id_user: number,
    description: string,
    image: string,
    location: Location,
    timeofPublishing: Date,
    isDelted: boolean
  }
  