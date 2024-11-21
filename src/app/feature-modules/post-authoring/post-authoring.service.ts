import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from './models/post';
import { UserProfile } from './models/user-profile.model';
import { Comment } from './models/comment';
import { PostCreation } from './models/postCreation';
import { RegisteredUser } from '../administrator/models/registered-user';

@Injectable({
  providedIn: 'root'
})
export class PostAuthoringService {

  constructor(private http: HttpClient) { }

  getPosts(loggedInUser: RegisteredUser): Observable<Post[]> {
    const token = localStorage.getItem("jwt");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Dodavanje Bearer tokena
      'Accept': 'application/json'
    });
    return this.http.get<Post[]>(`http://localhost:8080/api/posts`, { headers });
  }

  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`http://localhost:8080/api/posts/${id}`);
  }

  getUserProfile(userId: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`http://localhost:8080/api/users/profile/${userId}`);
  }


  likePost(postId: number, userId: number): Observable<Post> {
    const token = localStorage.getItem("jwt");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Dodavanje Bearer tokena
      'Accept': 'application/json'
    });
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.post<Post>(`http://localhost:8080/api/posts/${postId}/like`, {}, { headers, params });
  }

  addComment(postId: number, userId: number, content: string): Observable<Comment> {
    const token = localStorage.getItem("jwt");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Dodavanje Bearer tokena
      'Accept': 'application/json'
    });
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('content', content);
    return this.http.post<Comment>(`http://localhost:8080/api/posts/${postId}/comment`, {}, { headers, params });
  }

  updatePost(postId: number, userId: number, newDescription: string, newImage: string): Observable<Post> {
    const token = localStorage.getItem("jwt");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Dodavanje Bearer tokena
      'Accept': 'application/json'
    });
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('newDescription', newDescription)
      .set('newImage', newImage);
    return this.http.put<Post>(`http://localhost:8080/api/posts/${postId}`, {}, { headers, params });
  }

  deletePost(postId: number, userId: number): Observable<void> {
    const token = localStorage.getItem("jwt");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Dodavanje Bearer tokena
      'Accept': 'application/json'
    });
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.delete<void>(`http://localhost:8080/api/posts/${postId}`, { headers, params });
  }

  isPostLiked(postId: number, userId: number): Observable<boolean> {
    const token = localStorage.getItem("jwt");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Dodavanje Bearer tokena
      'Accept': 'application/json'
    });
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get<boolean>(`http://localhost:8080/api/posts/${postId}/isLiked`, { headers, params });
  }

  createNewPost(newPost : PostCreation): Observable<PostCreation>{
    return this.http.post<PostCreation>(`http://localhost:8080/api/posts/create`, newPost);
  }

  followUser(userId: number): Observable<void> {
    const token = localStorage.getItem("jwt");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Dodavanje Bearer tokena
      'Accept': 'application/json'
    });
    return this.http.put<void>(`http://localhost:8080/api/users/follow/${userId}`, {}, { headers });
  }

  unfollowUser(userId: number): Observable<void> {
    const token = localStorage.getItem("jwt");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Dodavanje Bearer tokena
      'Accept': 'application/json'
    });
    return this.http.delete<void>(`http://localhost:8080/api/users/unfollow/${userId}`, { headers });
  }

  isFollowingUser(userId: number): Observable<boolean> {
    const token = localStorage.getItem("jwt");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Dodavanje Bearer tokena
      'Accept': 'application/json'
    });
    return this.http.get<boolean>(`http://localhost:8080/api/users/isFollowing/${userId}`, { headers });
  }

  getFollowingsAccounts(userId: number): Observable<UserProfile[]> {
    const token = localStorage.getItem("jwt");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Dodavanje Bearer tokena
      'Accept': 'application/json'
    });
    return this.http.get<UserProfile[]>(`http://localhost:8080/api/users/following/${userId}`, { headers });
  }

}
