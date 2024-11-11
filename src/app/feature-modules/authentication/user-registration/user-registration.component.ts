import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '../model/location.model';
import { AuthenticationService } from '../authentication.service';
import { Registration } from '../model/user-registration.model';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit{

  registrationForm: FormGroup;
  availableLocations: Location[] = [];
  registrationSuccess: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService // Inject the service
  ) {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      location: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadLocations(); // Call method to load locations on init
  }

  loadLocations(): void {
    this.authService.getAllLocations().subscribe({
      next: (locations) => (this.availableLocations = locations),
      error: (error) => console.error('Error fetching locations:', error)
    });
  }

  registerUser(): void {
    if (this.registrationForm.valid) {
      // Find the selected location based on the selected location ID
      const selectedLocationId = this.registrationForm.value.location;
      console.log(selectedLocationId);
      const selectedLocation = this.availableLocations.find(
        loc => loc.id === Number(selectedLocationId)
      );
      console.log(selectedLocation);
      // If selectedLocation exists, construct the formData with the full Location object
      const formData: Registration = {
        id: 0, 
        username: this.registrationForm.value.username,
        password: this.registrationForm.value.password,
        firstName: this.registrationForm.value.firstName,
        lastName: this.registrationForm.value.lastName,
        email: this.registrationForm.value.email,
        location: selectedLocation ? selectedLocation : { id: 1, latitude:0, longitude:0, country: '', city: ''}, // Ensure Location object
        isActivated: false 
      };

      console.log(JSON.stringify(formData, null, 2));

      this.authService.registerUser(formData).subscribe({
        next: () => {
          this.registrationSuccess = true;
          this.errorMessage = null;
        },
        error: (error) => {
          this.registrationSuccess = false;
          this.errorMessage = 'Registration failed. Please try again.';
          console.error('Error during registration:', error);
        }
      });
    }
  }
}
