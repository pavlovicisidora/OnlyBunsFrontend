import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private map!: L.Map;

  setMap(map: L.Map): void {
    this.map = map;
  }

  getMap(): L.Map {
    return this.map;
  }

  addMarker(lat: number, lng: number): void {
    L.marker([lat, lng]).addTo(this.map);
  }
}