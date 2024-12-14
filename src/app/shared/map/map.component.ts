import { Component, AfterViewInit, Output, EventEmitter, Input, SimpleChanges, OnChanges } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from './map.service';

@Component({
  selector: 'xp-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit, OnChanges {
  @Input() currentPosition!: L.LatLng;
  @Output() mapClick = new EventEmitter<{ lat: number, lng: number }>();


  private map: any;
  private singleMarker?: L.Marker;
  private MAPBOX_URL_KEY: string = "pk.eyJ1IjoibW9tY2lsbzAyIiwiYSI6ImNtMmVxMDJndzAweDgyanNpYmpiMXc3dGMifQ.e2efHMHGaA8JJ65_CvKrcQ";
  private waypoints: L.LatLng[] = [];
  private routeControl: any;
  private currentMarker?: L.Marker;
  mapProfile: string = 'mapbox/walking';

  constructor(private mapService: MapService) {}

  ngOnChanges(changes: SimpleChanges): void {
    
    if(changes['currentPosition'] && this.map){
      this.updateCurrentMarker();
    }
  }

  private initMap(): void {
    if (this.map) return; // Provera da li je mapa već inicijalizovana
    
    this.map = L.map('map', {
      center: [45.2396, 19.8227],
      zoom: 13,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );
    tiles.addTo(this.map);
    this.registerOnClick();
  }

  registerOnClick(): void {
    // Osigurava da nema prethodnih `click` eventova pre nego što registruje novi
    this.map.off('click');
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      this.mapService.reverseSearch(lat,lng).subscribe((res)=>{});
      
      if (this.singleMarker) {
        this.singleMarker.remove();
      }

      this.singleMarker = L.marker([lat, lng]).addTo(this.map);
      this.mapClick.emit({ lat, lng });
      this.waypoints.push(L.latLng(lat, lng));
    });
  }

  search(): void {
    this.mapService.search('Strazilovska 19, Novi Sad').subscribe({
      next: (result) => {
        L.marker([result[0].lat, result[0].lon])
          .addTo(this.map)
          .bindPopup('Pozdrav iz Strazilovske 19.')
          .openPopup();
      },
      error: () => {},
    });
  }

  ngAfterViewInit(): void {
    const DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
    });

    L.Marker.prototype.options.icon = DefaultIcon;
    this.initMap(); // Poziva inicijalizaciju mape samo jednom
  }
  updateCurrentMarker(): void {
    // Remove existing marker if it exists
    if (this.currentMarker) {
      this.map.removeLayer(this.currentMarker);
    }

    // Add new marker for tourist position
    this.currentMarker = L.marker([this.currentPosition.lat, this.currentPosition.lng]).addTo(this.map);
    //this.map.setView([this.touristPosition.lat, this.touristPosition.lng], this.map.getZoom());
  }
  
 

  private getCustomIcon(color: string): L.Icon {
    // Ensure the color is URL-encoded, which will handle the hex value correctly
    const encodedColor = encodeURIComponent(color);
  
    return L.icon({
      iconUrl: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 50'%3E%3Cpath d='M15 0C8.25 0 3 6.5 3 12c0 5.5 8 21 12 25.5 4-4.5 12-20 12-25.5 0-5.5-5.25-12-12-12z' fill='${encodedColor}'/%3E%3Ccircle cx='15' cy='12' r='4' fill='%23fff' /%3E%3C/svg%3E`,
      iconSize: [50, 75],
      iconAnchor: [15, 50],
      popupAnchor: [0, -40],
      shadowUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-shadow.png',
      shadowSize: [75, 60],
    });
  }
}
