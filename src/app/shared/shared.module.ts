import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapComponent } from './map/map.component';


import { Routes } from '@angular/router';
import { DisplayLocationMapComponent } from './display-location-map/display-location-map.component';



@NgModule({
  declarations: [
    MapComponent,
    DisplayLocationMapComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [MapComponent]
})
export class SharedModule { }
