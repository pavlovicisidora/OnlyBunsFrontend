import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from './models/post';
import { UserProfile } from './models/user-profile.model';
import { Comment } from './models/comment';

@Injectable({
  providedIn: 'root'
})
export class PostAuthoringService {

  constructor(private http: HttpClient) { }

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`http://localhost:8080/api/posts/all`);
  }

  getUserProfile(userId: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`http://localhost:8080/api/users/profile/${userId}`);
  }

  likePost(postId: number, userId: number): Observable<Post> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.post<Post>(`http://localhost:8080/api/posts/${postId}/like`, {}, { params });
  }

  addComment(postId: number, userId: number, content: string): Observable<Comment> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('content', content);
    return this.http.post<Comment>(`http://localhost:8080/api/posts/${postId}/comment`, {}, { params });
  }

  updatePost(postId: number, userId: number, newDescription: string, newImage: string): Observable<Post> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('newDescription', newDescription)
      .set('newImage', newImage);
    return this.http.put<Post>(`http://localhost:8080/api/posts/${postId}`, {}, { params });
  }

  deletePost(postId: number, userId: number): Observable<void> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.delete<void>(`http://localhost:8080/api/posts/${postId}`, { params });
  }

  isPostLiked(postId: number, userId: number): Observable<boolean> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get<boolean>(`http://localhost:8080/api/posts/${postId}/isLiked`, { params });
  }
}
