import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './feature-modules/Layout/layout.module';
import { RouterModule } from '@angular/router';
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
    PostAuthoringModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
