import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from './models/post';

@Injectable({
  providedIn: 'root'
})
export class PostAuthoringService {

  constructor(private http: HttpClient) { }

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`http://localhost:8080/api/posts/all`);
  }
}
