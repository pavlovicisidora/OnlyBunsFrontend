import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisteredUser } from './models/registered-user';

@Injectable({
  providedIn: 'root'
})
export class AdministratorService {
  constructor(private http: HttpClient) {}

  getAllUsers(page: number, size: number): Observable<any> {
    const token = localStorage.getItem("jwt");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    
    return this.http.get<any>(`http://localhost:8080/api/users/all`, { headers, params });
  }

  searchUsers(searchParams: any, page: number, size: number): Observable<any> {
    const token = localStorage.getItem("jwt");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (searchParams.firstName) params = params.set('firstName', searchParams.firstName);
    if (searchParams.lastName) params = params.set('lastName', searchParams.lastName);
    if (searchParams.email) params = params.set('email', searchParams.email);
    if (searchParams.minPostCount !== null) params = params.set('minPosts', searchParams.minPostCount.toString());
    if (searchParams.maxPostCount !== null) params = params.set('maxPosts', searchParams.maxPostCount.toString());
    if (searchParams.sortDirection !== null) params = params.set('sortDirection', searchParams.sortDirection.toString());
    if (searchParams.sortBy !== null) params = params.set('sortBy', searchParams.sortBy.toString());

    return this.http.get<any>(`http://localhost:8080/api/users/search`, { headers, params });
  }
}
