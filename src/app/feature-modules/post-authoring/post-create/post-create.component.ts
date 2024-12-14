import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostAuthoringService } from '../post-authoring.service';
import { PostCreation } from '../models/postCreation';
import { Location } from '../../authentication/model/location.model';
import { UserProfile } from '../models/user-profile.model';
import { RegisteredUser } from '../../administrator/models/registered-user';
import { AuthenticationService } from '../../authentication/authentication.service';
import { HttpClient } from '@angular/common/http'; 

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  postForm: FormGroup;
  previewUrl: string | null = null; // Za prikaz slike
  selectedFile: File | null = null; // Privremeno čuvanje fajla
  selectedCoordinates: { lat: number, lng: number } | null = null;
  
  SelectedLongitude: number = 0;
  SelectedLatitude: number = 0;
  SelectedCountry: string = '';
  SelectedCity: string = '';

  loggedInUser: RegisteredUser = { 
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    postCount: 0,
    followersCount: 0,
  };
  

  constructor(
    private fb: FormBuilder,
    private postAuthoringService: PostAuthoringService,
    private userService: AuthenticationService,
    private http: HttpClient
  ) {
    this.postForm = this.fb.group({
      description: ['', Validators.required],
      image: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required]
    });
  }
  
  ngOnInit(): void {
    this.userService.getUserInfo().subscribe({
      next: (loggedInUser) => this.loggedInUser = loggedInUser,
      error: (err) => console.error('Error fetching loggedInUser:', err)
    });
  }
  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.selectedFile = file; // Čuvamo fajl lokalno
      const reader = new FileReader();

      reader.onload = () => {
        this.previewUrl = reader.result as string; // Postavljamo URL za prikaz slike
      };

      reader.readAsDataURL(file); // Čitamo fajl kao base64 string
    }
  }
 
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


  onSubmit(): void {
    if (this.postForm.valid && this.selectedFile) {
      const formValues = this.postForm.value;

      const location: Location = {
        id: 0,
        longitude: this.SelectedLongitude,
        latitude: this.SelectedLatitude,
        country: this.SelectedCountry,
        city: this.SelectedCity
      };

     

      const newPost: PostCreation = {
        user: this.loggedInUser,
        description: formValues.description,
        image:  this.selectedFile.name,
        location: location,
        timeOfPublishing: new Date(),
        isDeleted: false
      };

      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);
      console.log((this.selectedFile));
      console.log(this.selectedFile.name)

      this.postAuthoringService.addImage(formData).subscribe({
        next: (res) => {
          console.log('added image' + res)

          
          this.postAuthoringService.createNewPost(newPost).subscribe(() => {
              console.log("Post created successfully!");
              this.resetForm(); // Resetovanje forme nakon uspešne operacije
          });
        },
        error: (err) => {
          console.error("Failed to upload image:", err);
        }
      });
    }
  }

  resetForm(): void {
    this.postForm.reset();
    this.previewUrl = null;
    this.selectedFile = null;
  }



  getImage(path: string): void{
    this.postAuthoringService.getImage(path).subscribe(blob =>{
      const image = URL.createObjectURL(blob);
      //this.imageMap.set(path,image);
    })
  }

  setCoordinates(lat:number,lng:number){
    this.postForm.patchValue({
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





     
    
  }
