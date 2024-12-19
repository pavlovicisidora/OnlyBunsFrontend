import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component'; 
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { TrendsComponent } from './ToImplement/trends/trends.component';
import { ChatComponent } from './ToImplement/chat/chat.component';
import { MapComponent } from './ToImplement/map/map.component';
import { ForUComponent } from './ToImplement/for-u/for-u.component';
import { AboutComponent } from './ToImplement/about/about.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms'; 

@NgModule({
declarations: [
    HomeComponent,
    NavbarComponent,
    TrendsComponent,
    ChatComponent,
    MapComponent,
    ForUComponent,
    AboutComponent
],
imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule
],
exports:[
    NavbarComponent,
    HomeComponent,
]


})
export class LayoutModule {  }




