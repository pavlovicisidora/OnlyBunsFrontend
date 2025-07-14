import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '../model/location.model';
import { AuthenticationService } from '../authentication.service';
import { Registration } from '../model/user-registration.model';
import { HttpClient } from '@angular/common/http'; 
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit{

  usernameTaken: boolean = false;

  registrationForm: FormGroup;
  availableLocations: Location[] = [];
  registrationSuccess: boolean = false;
  errorMessage: string | null = null;
  showFormError: boolean = false;
  SelectedLongitude: number = 0;
  SelectedLatitude: number = 0;
  SelectedCountry: string = '';
  SelectedCity: string = '';
  selectedCoordinates: { lat: number, lng: number } | null = null;
  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService, // Inject the service
    private http: HttpClient
  ) {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')],
      ],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required], // Potvrda šifre
    },
    {
      validators: this.passwordsMatchValidator('password', 'confirmPassword'), // Validacija za jednakost šifri
    }
  );
  }

  ngOnInit(): void {
   
  }

  loadLocations(): void {
    this.authService.getAllLocations().subscribe({
      next: (locations) => (this.availableLocations = locations),
      error: (error) => console.error('Error fetching locations:', error)
    });
  }

  showPasswordMismatchError(): boolean {
    const passwordControl = this.registrationForm.get('password');
    const confirmPasswordControl = this.registrationForm.get('confirmPassword');
  
    // Proveravamo da li su oba kontrolera definisana
    if (!passwordControl || !confirmPasswordControl) {
      return false; // Ako nisu, greška se ne prikazuje
    }
  
    // Prikaz greške samo ako je Confirm Password uneto i validacija ne prolazi
    return (
      confirmPasswordControl.touched &&
      confirmPasswordControl.dirty &&
      this.registrationForm.hasError('passwordMismatch')
    );
  }
  
  
  isFieldInvalid(fieldName: string): boolean {
    const field = this.registrationForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
  




  registerUser(): void {
    if (this.registrationForm.valid) {
      this.showFormError = false;
      const username = this.registrationForm.value.username;
  
      // Provera da li username postoji
      this.authService.checkUsernameExists(username).subscribe({
        next: (exists) => {
          if (exists) {
            this.usernameTaken = true;
            this.scrollToTop('formErrorSection');
          } else {
            this.usernameTaken = false;
  
            const location: Location = {
              id: 0,
              longitude: this.SelectedLongitude,
              latitude: this.SelectedLatitude,
              country: this.SelectedCountry,
              city: this.SelectedCity
            };
  
            const formData: Registration = {
              id: 0, 
              username: this.registrationForm.value.username,
              password: this.registrationForm.value.password,
              firstName: this.registrationForm.value.firstName,
              lastName: this.registrationForm.value.lastName,
              email: this.registrationForm.value.email,
              location: location,
              isActivated: false 
            };
  
            console.log(JSON.stringify(formData, null, 2));
  
            this.authService.registerUser(formData).subscribe({
              next: () => {
                this.resetForm();
                this.SelectedCity = '';
                this.SelectedCountry = '';
              },
              error: (error) => {
                this.registrationSuccess = false;
                this.errorMessage = 'Registration failed. Please try again.';
                console.error('Error during registration:', error);
              }
            });
          }
        },
        error: (error) => {
          console.error('Error checking username:', error);
        }
      });
    } else {
      this.showFormError = true;
      this.scrollToTop('formErrorSection');
      this.markAllFieldsAsTouched();
    }
  }
  

  scrollToTop(sectionId: string): void {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' }); // Glatko skrolovanje
    }
  }
  
  

  
  

  markAllFieldsAsTouched(): void {
    Object.keys(this.registrationForm.controls).forEach(field => {
      const control = this.registrationForm.get(field);
      control?.markAsTouched();
    });
  }

  /* MAPA */
  reverseGeocode(lat: number, lng: number): void {
    // Construct the Nominatim reverse geocoding URL
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;

    // Use HttpClient to make the request
    this.http.get(url)
      .subscribe((response: any) => {
        const address = response.display_name;
        this.SelectedCity = response.address.village || response.address.town || response.address.city;
        this.SelectedCountry = response.address.country;

        //console.log(`Address: ${address}`);
        console.log(`City: ${ this.SelectedCity}`);
        console.log(`Country: ${this.SelectedCountry}`);
      }, error => {
        console.error('Error during reverse geocoding:', error);
      });
  }

  resetForm(): void {
    this.registrationForm.reset();
    
  }

  setCoordinates(lat:number,lng:number){
    this.registrationForm.patchValue({
      latitude:lat,
      longitude:lng
    });
  }

  onMapClick(event: { lat: number, lng: number }) : void{
    const { lat, lng } = event;
    console.log(`Selected coordinates: Latitude ${lat}, Longitude ${lng}`);
    this.SelectedLatitude = lat;
    this.SelectedLongitude = lng;
    this.reverseGeocode(lat,lng);
  }


    // Proverava da li su šifre jednake
    passwordsMatchValidator(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
      return (form: AbstractControl) => {
        const password = form.get(passwordKey)?.value;
        const confirmPassword = form.get(confirmPasswordKey)?.value;
  
        if (password !== confirmPassword) {
          return { passwordMismatch: true };
        }
        return null;
      };
    }
}
