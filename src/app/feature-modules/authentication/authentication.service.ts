import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Location } from './model/location.model';
import { Registration } from './model/user-registration.model';
import { JwtAuthenticationRequest } from './model/jwtAuthenticationRequest.model';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

 
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

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

    // Dodaj responseType: 'json' kako bi se odgovor tretirao kao JSON
    return this.http.post<any>('http://localhost:8080/auth/login', body, {
      headers: loginHeaders,
      responseType: 'json'
    }).pipe(
      map((res) => {
        console.log(res);
        this.access_token = res.accessToken;
        console.log(res.accessToken);
        localStorage.setItem("jwt", res.accessToken);
        return res;
      })
    );
  }

  logout() {
    //this.userService.currentUser = null;
    localStorage.removeItem("jwt");
    this.access_token = null;
    this.router.navigate(['/login']);
  }

  // Nova metoda za dobijanje informacija o korisniku
  getUserInfo(): Observable<any> {
    /*const token = localStorage.getItem("jwt");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Dodavanje Bearer tokena
      'Accept': 'application/json'
    });*/

    return this.http.get<any>('http://localhost:8080/user/userInfo');
  }

  tokenIsPresent() {
    return this.access_token != undefined && this.access_token != null;
  }

  getToken() {
    return this.access_token;
  }
}
