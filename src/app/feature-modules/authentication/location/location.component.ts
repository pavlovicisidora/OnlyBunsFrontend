import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Location } from '../model/location.model';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit{

  locations: Location[] = [];

  constructor(private service: AuthenticationService) {}


  ngOnInit(): void {
    this.loadLocations();
  }

  loadLocations() {
    this.service.getAllLocations().subscribe({
      next: (locations) => this.locations = locations,
      error: (err) => console.error('Error fetching posts:', err)
    });
  }

}
