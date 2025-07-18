import { Component, Input, AfterViewInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { AuthenticationService } from 'src/app/feature-modules/authentication/authentication.service';
import { UserProfile } from 'src/app/feature-modules/post-authoring/models/user-profile.model';
import { MapDisplayLocationMapService } from './display-location-map.service';
import { Post } from 'src/app/feature-modules/post-authoring/models/post';
import { RabbitCare } from '../models/rabbitCare';
import { PostAuthoringService } from 'src/app/feature-modules/post-authoring/post-authoring.service';
@Component({
  selector: 'app-display-location-map',
  templateUrl: './display-location-map.component.html',
  styleUrls: ['./display-location-map.component.css']
})
export class DisplayLocationMapComponent  implements AfterViewInit, OnDestroy{
  constructor(private authService: AuthenticationService,
              private mapService: MapDisplayLocationMapService,
              private postService: PostAuthoringService, 
  ) {}
  @Input() userLat!: number;
  @Input() userLng!: number;
  @Input() posts: Post[] = [];
  rabbitCareLocations: RabbitCare[] = [];
  imageCache: { [path: string]: string } = {};

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
    this.getImage(post.image);
    if (lat && lng) {
      
      let popupContent = `<img src="${this.imageCache[post.image]}" style="width: 150px; max-height: 150px; margin-top: 5px;"><br>`;
      popupContent += `<b>${post.description}</b>`;

      const postIcon = L.icon({
        iconUrl: 'assets/Bunny pin.png', 
        iconSize: [32, 44],           
        iconAnchor: [19, 38],         
        popupAnchor: [0, -36],       
      });

     L.marker([lat, lng], { icon: postIcon })
      .addTo(this.map)
      .bindPopup(popupContent);
    }
  }
}

getImage(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (this.imageCache[path]) {
      resolve(this.imageCache[path]);
    } else {
      this.postService.getImage(path).subscribe({
        next: blob => {
          const imageUrl = URL.createObjectURL(blob);
          this.imageCache[path] = imageUrl;
          resolve(imageUrl);
        },
        error: err => {
          console.error("Greška prilikom učitavanja slike", err);
          reject(err);
        }
      });
    }
  });
}


private async loadPosts(): Promise<void> {
  this.mapService.getPostsForMap().subscribe({
    next: async (posts: Post[]) => {
      this.posts = posts;

      const loadImagePromises = posts
        .filter(post => post.image)
        .map(post => this.getImage(post.image));

      try {
        await Promise.all(loadImagePromises); // sačekaj da se sve slike učitaju
        this.addPostMarkers(); // sada su sve slike u imageCache!
      } catch (error) {
        console.error('Greška prilikom učitavanja slika:', error);
      }
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
