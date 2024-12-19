import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../post-authoring/models/post';
import { Observable } from 'rxjs';
import { UserProfile } from '../post-authoring/models/user-profile.model';

@Injectable({
    providedIn: 'root'
  })
  export class LayoutService {

    
      constructor(private http: HttpClient) { }
    
      getTop5PostsIn7Days(): Observable<Post[]> {
        const token = localStorage.getItem("jwt");
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`, // Dodavanje Bearer tokena
          'Accept': 'application/json'
        });
        return this.http.get<Post[]>(`http://localhost:8080/api/posts/top-liked-7-days`, { headers });
      }


      getTop10PostsOfAllTime(): Observable<Post[]> {
        const token = localStorage.getItem("jwt");
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`, // Dodavanje Bearer tokena
          'Accept': 'application/json'
        });
        return this.http.get<Post[]>(`http://localhost:8080/api/posts/top-10-liked-in-forever`, { headers });
      }

      getTop10Users(): Observable<UserProfile[]> {
        const token = localStorage.getItem("jwt");
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`, // Dodavanje Bearer tokena
          'Accept': 'application/json'
        });
        return this.http.get<UserProfile[]>(`http://localhost:8080/api/users/top-10-users-for-likes`, { headers });
      }


      getNumberOfAllPosts(): Observable<Number> {
        const token = localStorage.getItem("jwt");
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`, // Dodavanje Bearer tokena
          'Accept': 'application/json'
        });
        return this.http.get<Number>(`http://localhost:8080/api/posts/countPosts`, { headers });
      }

      getNumberOfPostsThisMonth(): Observable<Number> {
        const token = localStorage.getItem("jwt");
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`, // Dodavanje Bearer tokena
          'Accept': 'application/json'
        });
        return this.http.get<Number>(`http://localhost:8080/api/posts/count/last-month`, { headers });
      }
  }