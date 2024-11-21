import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'xp-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @Output() coordinatesSelected = new EventEmitter<{ lat: number, lng: number }>();

  constructor() { }

  ngOnInit(): void {
    // Create a map instance
    const map = L.map('map').setView([51.505, -0.09], 13);

    // Add a tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Handle click events on the map
    map.on('click', (event: L.LeafletMouseEvent) => {
      const { lat, lng } = event.latlng;
      this.coordinatesSelected.emit({ lat, lng });
    });
  }
}