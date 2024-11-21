import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostAuthoringService } from '../post-authoring.service';
import { PostCreation } from '../models/postCreation';
import { Location } from '../../authentication/model/location.model';
import { UserProfile } from '../models/user-profile.model';
import { RegisteredUser } from '../../administrator/models/registered-user';
import { AuthenticationService } from '../../authentication/authentication.service';

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
  private marker?: L.Marker;

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
    private userService: AuthenticationService
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
 

  onSubmit(): void {
    if (this.postForm.valid && this.selectedFile) {
      const formValues = this.postForm.value;

      const location: Location = {
        id: 1,
        longitude: 0,
        latitude: 0,
        country: formValues.country,
        city: formValues.city
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

  onCoordinatesSelected(event: { lat: number, lng: number }){
   // this.selectedCoordinates = event.lat, event.;
    console.log('Selected coordinates:', this.selectedCoordinates);
  }





     
    
  }
