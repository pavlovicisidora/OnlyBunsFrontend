import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-email-activation',
  templateUrl: './email-activation.component.html',
  styleUrls: ['./email-activation.component.css']
})
export class EmailActivationComponent implements OnInit {

  userId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    // Preuzimanje ID korisnika iz query parametra kada komponenta bude inicijalizovana
    this.route.queryParams.subscribe(params => {
      this.userId = +params['id'];  // '+' konvertuje string u number
    });
  }

  emailActivation(): void {
    if (this.userId !== null) {
      this.authService.activateEmail(this.userId).subscribe(
        (response) => {
          console.log('Email successfully activated', response);
          // Možete dodati poruku korisniku ili preusmeriti ga na drugu stranicu
        },
        (error) => {
          console.error('Error activating email', error);
        }
      );
    } else {
      console.error('User ID is missing');
    }
  }
}
