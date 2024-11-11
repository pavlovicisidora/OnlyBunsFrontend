import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './feature-modules/Layout/layout.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms'; 
import { MatInputModule } from '@angular/material/input'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button'; 
import { MatSelectModule } from '@angular/material/select';  
import { MatDialogModule } from '@angular/material/dialog';  
import { MatIconModule } from '@angular/material/icon'; 
import { AuthenticationModule } from './feature-modules/authentication/authentication.module';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { AdministratorModule } from './feature-modules/administrator/administrator.module';
import { PostAuthoringModule } from './feature-modules/post-authoring/post-authoring.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    AdministratorModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,  
    MatInputModule,      
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,     
    MatIconModule,
    AuthenticationModule,
    HttpClientModule,
    PostAuthoringModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
