import { Comment } from "./comment";

export interface Post {
    id: number;
    description: string;
    image: string;
    likeCount: number;
    comments: Comment[];
  }
  