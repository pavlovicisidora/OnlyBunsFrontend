import { Component, Input, AfterViewInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { AuthenticationService } from 'src/app/feature-modules/authentication/authentication.service';
import { UserProfile } from 'src/app/feature-modules/post-authoring/models/user-profile.model';
import { MapDisplayLocationMapService } from './display-location-map.service';
import { Post } from 'src/app/feature-modules/post-authoring/models/post';
import { RabbitCare } from '../models/rabbitCare';

@Component({
  selector: 'app-display-location-map',
  templateUrl: './display-location-map.component.html',
  styleUrls: ['./display-location-map.component.css']
})
export class DisplayLocationMapComponent  implements AfterViewInit, OnDestroy{
  constructor(private authService: AuthenticationService,
              private mapService: MapDisplayLocationMapService
  ) {}
  @Input() userLat!: number;
  @Input() userLng!: number;
  @Input() posts: Post[] = [];
  rabbitCareLocations: RabbitCare[] = [];


  private map!: L.Map;

 ngAfterViewInit(): void {
  this.authService.getUserInfo().subscribe({
    next: (user: UserProfile) => {
      const lat = user.location.latitude; // zameni sa tačnim imenom iz backend objekta
      const lng = user.location.longitude;

      this.initMap(lat, lng);
      this.loadPosts();
      this.loadRabbitCareLocations(); 
    },
    error: err => {
      console.error('Greška pri dohvatanju korisnika', err);
      // Fallback lokacija (npr. Novi Sad)
      this.initMap(45.2671, 19.8335);
    }
  });
}

private addPostMarkers(): void {
  for (const post of this.posts) {
    const lat = post.location.latitude;
    const lng = post.location.longitude;

    if (lat && lng) {
      const popupContent = `
        <b>${post.description}</b><br>
      `;

      const postIcon = L.icon({
        iconUrl: 'assets/Bunny pin.png', 
        iconSize: [30, 40],           
        iconAnchor: [19, 38],         
        popupAnchor: [0, -36],       
      });

     L.marker([lat, lng], { icon: postIcon })
      .addTo(this.map)
      .bindPopup(popupContent);
    }
  }
}


private loadPosts(): void {
  this.mapService.getPostsForMap().subscribe({
    next: (posts: Post[]) => {
      console.log('Dobijeni postovi:', posts); // <--- DODAJ OVO
      this.posts = posts;
      this.addPostMarkers();
    },
    error: err => {
      console.error('Greška prilikom dobijanja postova za mapu:', err);
    }
  });
}

  private initMap(lat: number, lng: number): void {
  this.map = L.map('posts-map').setView([lat, lng], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(this.map);

  const userIcon = L.icon({
  iconUrl: 'assets/myLocation2.png', // stavi svoju ikonicu ovde ako želiš
  iconSize: [41, 41],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

L.marker([lat, lng], { icon: userIcon })
  .addTo(this.map)
  .bindPopup('Vaša lokacija');
 // this.addPostMarkers();
}

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove(); // očisti Leaflet instancu
    }
  }

    private rabbitCareIcon = L.icon({
    iconUrl: 'assets/hospital.png',   // stavi ikonicu klinike ili kućice u assets
    iconSize: [35, 40],
    iconAnchor: [17, 40],
    popupAnchor: [0, -38],
  });

  private addRabbitCareMarkers(): void {
    for (const location of this.rabbitCareLocations) {
      const { latitude, longitude, name, city, country } = location;
      const popupContent = `
        <b>${name}</b><br>
        ${city}, ${country}
      `;

      L.marker([latitude, longitude], { icon: this.rabbitCareIcon })
        .addTo(this.map)
        .bindPopup(popupContent);
    }
  }

  private loadRabbitCareLocations(): void {
    this.mapService.getAllRabbitCareLocations().subscribe({
      next: (locations: RabbitCare[]) => {
        this.rabbitCareLocations = locations;
        this.addRabbitCareMarkers();
      },
      error: err => {
        console.error('Greška prilikom učitavanja lokacija za zečevu negu:', err);
      }
    });
  }



}
