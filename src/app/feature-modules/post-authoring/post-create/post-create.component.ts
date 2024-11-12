import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostAuthoringService } from '../post-authoring.service';
import { PostCreation } from '../models/postCreation';
import { Location } from '../../authentication/model/location.model';
import { UserProfile } from '../models/user-profile.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  postForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private postAuthoringService: PostAuthoringService
  ) {
    this.postForm = this.fb.group({
      description: ['', Validators.required],
      image: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Any initialization if necessary
  }

  onSubmit(): void {
    if (this.postForm.valid) {
      const formValues = this.postForm.value;

      const location: Location = {
        id: 1,
        longitude: 0,
        latitude: 0,
        country: formValues.country,
        city: formValues.city
      };

      const user: UserProfile = {
        id:1,
        firstName: "Srdjan",
        lastName: "Vukojevic",
        email: "srdjan@gmail.com",
        postCount: 1,
        followersCount: 1,
      }

      const newPost: PostCreation = {
        user: user,
        description: formValues.description,
        image: formValues.image,
        location: location,
        timeOfPublishing: new Date(),
        isDelted: false
      };

        console.log(newPost);
        this.postAuthoringService.createNewPost(newPost).subscribe(post => {
          console.log("Succesfully!");
        });
      }
     
    }
  }
