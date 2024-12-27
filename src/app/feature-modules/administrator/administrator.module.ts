import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegisteredUsersViewComponent } from './registered-users-view/registered-users-view.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AppAnalyticsComponent } from './app-analytics/app-analytics.component';


@NgModule({
declarations: [
    RegisteredUsersViewComponent,
    AppAnalyticsComponent
],
imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
],
exports:[
    RegisteredUsersViewComponent
]


})
export class AdministratorModule {  }


