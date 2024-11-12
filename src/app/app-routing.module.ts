import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './feature-modules/Layout/home/home.component';
import { UserRegistrationComponent } from './feature-modules/authentication/user-registration/user-registration.component';
import { EmailActivationComponent } from './feature-modules/authentication/email-activation/email-activation.component';
import { LoginComponent } from './feature-modules/authentication/login/login.component';
import { NgModel } from '@angular/forms';
import { RegisteredUsersViewComponent } from './feature-modules/administrator/registered-users-view/registered-users-view.component';
import { PostComponent } from './feature-modules/post-authoring/post/post.component';
import { UserProfileComponent } from './feature-modules/post-authoring/user-profile/user-profile.component';
const routes: Routes =[
    {path: '',component: HomeComponent},
    {path: 'home',component: HomeComponent},
    {path: 'users-view',component: RegisteredUsersViewComponent},
    {path: 'posts-view',component: PostComponent},
    {path: 'registration', component: UserRegistrationComponent},
    {path: 'login', component: LoginComponent},
    {path: 'activation', component: EmailActivationComponent},
    {path: 'user-profile', component: UserProfileComponent}

];
@NgModule({
    imports:[RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }







