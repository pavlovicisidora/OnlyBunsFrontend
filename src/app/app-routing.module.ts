import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './feature-modules/Layout/home/home.component';
import { UserRegistrationComponent } from './feature-modules/authentication/user-registration/user-registration.component';
import { EmailActivationComponent } from './feature-modules/authentication/email-activation/email-activation.component';
import { LoginComponent } from './feature-modules/authentication/login/login.component';
import { NgModel } from '@angular/forms';
import { RegisteredUsersViewComponent } from './feature-modules/administrator/registered-users-view/registered-users-view.component';
import { PostComponent } from './feature-modules/post-authoring/post/post.component';
import { PostCreateComponent } from './feature-modules/post-authoring/post-create/post-create.component';
import { UserProfileComponent } from './feature-modules/post-authoring/user-profile/user-profile.component';
import { TrendsComponent } from './feature-modules/Layout/ToImplement/trends/trends.component';
import { ChatComponent } from './feature-modules/Layout/ToImplement/chat/chat.component';
import { MapComponent } from './feature-modules/Layout/ToImplement/map/map.component';
import { ForUComponent } from './feature-modules/Layout/ToImplement/for-u/for-u.component';
import { AboutComponent } from './feature-modules/Layout/ToImplement/about/about.component';
import { ProfileInfoComponent } from './feature-modules/Layout/ToImplement/profile-info/profile-info.component';
const routes: Routes =[
    {path: '',component: HomeComponent},
    {path: 'home',component: HomeComponent},
    {path: 'users-view',component: RegisteredUsersViewComponent},
    {path: 'posts-view',component: PostComponent},
    {path: 'registration', component: UserRegistrationComponent},
    {path: 'login', component: LoginComponent},
    {path: 'activation', component: EmailActivationComponent},
    {path: 'create-post', component: PostCreateComponent},
    {path: 'user-profile', component: UserProfileComponent},
    {path: 'trends', component: TrendsComponent},
    {path: 'chat', component: ChatComponent},
    {path: 'map', component: MapComponent},
    {path: 'forU', component:ForUComponent},
    {path: 'about', component: AboutComponent},
    {path: 'profileInfo', component: ProfileInfoComponent}
    

];
@NgModule({
    imports:[RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }







