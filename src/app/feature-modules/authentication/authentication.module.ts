import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; 
import { MatInputModule } from '@angular/material/input'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button'; 
import { MatSelectModule } from '@angular/material/select';  
import { MatDialogModule } from '@angular/material/dialog';  
import { MatIconModule } from '@angular/material/icon'; 
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { LocationComponent } from './location/location.component';
import { LoginComponent } from './login/login.component';
import { EmailActivationComponent } from './email-activation/email-activation.component';
import { RouterModule } from '@angular/router';

@NgModule({
declarations: [
    UserRegistrationComponent,
    LocationComponent,
    LoginComponent,
    EmailActivationComponent,
  ],
imports: [
    CommonModule,
    ReactiveFormsModule,  
    MatInputModule,      
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,     
    MatIconModule,
    RouterModule,
],
exports:[
  UserRegistrationComponent,
  LocationComponent
]


})
export class AuthenticationModule {  }




