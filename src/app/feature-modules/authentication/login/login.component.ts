import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegisteredUser } from '../../administrator/models/registered-user';

interface DisplayMessage {
  msgType: string;
  msgBody: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

   loggedInUser: RegisteredUser = { 
      id: 0,
      firstName: '',
      lastName: '',
      email: '',
      postCount: 0,
      followersCount: 0,
    };
    
  loginForm: FormGroup;
  errorMessage: string | null = null;
  ngOnInit(): void {}

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
  ) {
    
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;

      // Pozivanje servisa za login
      this.authService.login(loginData).subscribe({
        next: (response) => {
          // Ako je login uspešan, spremite token u lokalnu memoriju
          localStorage.setItem('jwt', response.accessToken);
          console.log('Token set in localStorage:', response.accessToken);
          this.router.navigate(['/home']);
          // Redirektujte korisnika na home stranicu ili neku drugu stranicu
          
        },
        error: (error) => {
          this.errorMessage = 'Invalid username or password';
          console.error('Login error:', error);
        }
      });

    }
  }
}
