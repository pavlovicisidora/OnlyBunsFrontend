import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from 'src/app/feature-modules/post-authoring/models/post';
import { RabbitCare } from '../models/rabbitCare';

@Injectable({
  providedIn: 'root'
})
export class MapDisplayLocationMapService {

  constructor(private http: HttpClient) { }


  getPostsForMap(): Observable<Post[]> {
  const token = localStorage.getItem("jwt");
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  });

  return this.http.get<Post[]>(`http://localhost:8080/api/posts/posts-for-map`, { headers });
}
  


  getAllRabbitCareLocations(): Observable<RabbitCare[]> {
    const token = localStorage.getItem("jwt");
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  });
    return this.http.get<RabbitCare[]>('http://localhost:8080/api/rabbitCareLocation/all', { headers });
  }


}
