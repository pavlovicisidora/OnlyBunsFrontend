import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Location } from './model/location.model';
import { Registration } from './model/user-registration.model';
import { JwtAuthenticationRequest } from './model/jwtAuthenticationRequest.model';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { RegisteredUser } from '../administrator/models/registered-user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$: Observable<any> = this.currentUserSubject.asObservable();
 
  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const token = localStorage.getItem('jwt');
    if (token) {
      this.getUserInfo().subscribe(userInfo => {
        this.currentUserSubject.next(userInfo); // Ako postoji token, postavljamo currentUser
      });
    }
  }

  private access_token = null;

  getAllLocations(): Observable<Location[]> {
    return this.http.get<Location[]>('http://localhost:8080/location/all');
  }

  registerUser(userData: Registration): Observable<Registration> {

    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
   /* return this.http.post<Registration>('http://localhost:8080/auth/signup', JSON.stringify(userData));*/
   return this.http.post<Registration>(
    'http://localhost:8080/auth/signup',
    JSON.stringify(userData),
    { headers } // Prosleđujemo zaglavlja kao deo opcija zahteva
  );
  }

  activateEmail(userId: number): Observable<any>{

    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
   return this.http.put<any>(
    `http://localhost:8080/auth/activate/${userId}`,
    { headers } // Prosleđujemo zaglavlja kao deo opcija zahteva
  );
  }


  login(user: JwtAuthenticationRequest): Observable<any> {
    const loginHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    const body = {
      'username': user.username,
      'password': user.password
    };

    
    return this.http.post<any>('http://localhost:8080/auth/login', body, {
      headers: loginHeaders,
      responseType: 'json'
    }).pipe(
      map((res) => {
        this.access_token = res.accessToken;
        localStorage.setItem("jwt", res.accessToken);
        this.getUserInfo().subscribe(userInfo => {
          this.currentUserSubject.next(userInfo);
        });
        return res;
      })
    );
  }

  logout() {
    this.currentUserSubject.next(null);
    localStorage.removeItem("jwt");
    this.access_token = null;
    this.router.navigate(['/login']);
  }

  // Nova metoda za dobijanje informacija o korisniku
  getUserInfo(): Observable<RegisteredUser> {
    const token = localStorage.getItem("jwt");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Dodavanje Bearer tokena
      'Accept': 'application/json'
    });

    return this.http.get<RegisteredUser>('http://localhost:8080/api/users/userInfo', {headers});
  }

  tokenIsPresent() {
    return this.access_token != undefined && this.access_token != null;
  }

  getToken() {
    return this.access_token;
  }
}
