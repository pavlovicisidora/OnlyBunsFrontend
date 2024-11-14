import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { UserService } from '../../authentication/user.service';
import { AuthenticationService } from '../../authentication/authentication.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit {
  
  constructor( private userService: UserService, private authService: AuthenticationService) { }

  ngOnInit() {
    // Pretplatite se na rezultat `getMyInfo` da biste ažurirali `currentUser`
    this.userService.getMyInfo().subscribe(user => {
      this.userService.currentUser = user;
    });
  }

  hasSignedIn() {
    
    return this.userService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
    this.userService.logout();
  }

}
