import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './feature-modules/Layout/home/home.component';
import { UserRegistrationComponent } from './feature-modules/authentication/user-registration/user-registration.component';
import { EmailActivationComponent } from './feature-modules/authentication/email-activation/email-activation.component';
import { LoginComponent } from './feature-modules/authentication/login/login.component';
const routes: Routes =[
    {path: '',component: HomeComponent},
    {path: 'home',component: HomeComponent},
    {path: 'registration', component: UserRegistrationComponent},
    {path: 'login', component: LoginComponent},
    {path: 'activation', component: EmailActivationComponent}
];
@NgModule({
    imports:[RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }







