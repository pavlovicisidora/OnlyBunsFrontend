import { Comment } from "./comment";
import { Location } from "../../authentication/model/location.model";

export interface Post {
    id: number;
    userId: number;
    description: string;
    image: string;
    location: Location;
    likeCount: number;
    comments: Comment[];
  }
  