import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapComponent } from './map/map/map.component';


import { Routes } from '@angular/router';



@NgModule({
  declarations: [
    MapComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [MapComponent]
})
export class SharedModule { }
