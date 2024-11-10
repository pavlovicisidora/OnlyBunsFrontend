import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisteredUsersViewComponent } from './registered-users-view/registered-users-view.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
declarations: [
    RegisteredUsersViewComponent
],
imports: [
    CommonModule,
    ReactiveFormsModule,
],
exports:[
    RegisteredUsersViewComponent
]


})
export class AdministratorModule {  }


