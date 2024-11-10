import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './feature-modules/Layout/home/home.component';
import { NgModel } from '@angular/forms';
import { RegisteredUsersViewComponent } from './feature-modules/administrator/registered-users-view/registered-users-view.component';

const routes: Routes =[
    {path: '',component: HomeComponent},
    {path: 'home',component: HomeComponent},
    {path: 'users-view',component: RegisteredUsersViewComponent}
];
@NgModule({
    imports:[RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }







