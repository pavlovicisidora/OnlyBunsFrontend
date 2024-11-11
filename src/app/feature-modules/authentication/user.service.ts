import {Injectable} from '@angular/core';
import { AuthenticationService } from './authentication.service';
import {map} from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

    currentUser!: any;

    constructor(private authService: AuthenticationService) {}

    getMyInfo(): Observable<any> {
    return this.authService.getUserInfo()
      .pipe(map(user => {
        this.currentUser = user;
        return user;
      }));
  }

    isLoggedIn(): boolean {
        return !!this.currentUser;  // Vraća true ako je currentUser postavljen (ulogovan je)
      }
    
      // Metoda za odjavljivanje korisnika
      logout() {
        this.currentUser = null;  // Resetuje currentUser
        localStorage.removeItem("jwt");  // Uklanja JWT token iz localStorage
      }

}
