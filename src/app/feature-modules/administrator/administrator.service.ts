import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisteredUser } from './models/registered-user';

@Injectable({
  providedIn: 'root'
})
export class AdministratorService {
  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<RegisteredUser[]> {
    return this.http.get<RegisteredUser[]>(`http://localhost:8080/api/users/all`);
  }

  searchUsers(searchParams: any): Observable<RegisteredUser[]> {
    let params = new HttpParams();

    if (searchParams.firstName) params = params.set('firstName', searchParams.firstName);
    if (searchParams.lastName) params = params.set('lastName', searchParams.lastName);
    if (searchParams.email) params = params.set('email', searchParams.email);
    if (searchParams.minPostCount !== null) params = params.set('minPosts', searchParams.minPostCount.toString());
    if (searchParams.maxPostCount !== null) params = params.set('maxPosts', searchParams.maxPostCount.toString());
    if (searchParams.sortDirection !== null) params = params.set('sortDirection', searchParams.sortDirection.toString());
    if (searchParams.sortBy !== null) params = params.set('sortBy', searchParams.sortBy.toString());

    return this.http.get<RegisteredUser[]>(`http://localhost:8080/api/users/search`, { params });
  }
}
