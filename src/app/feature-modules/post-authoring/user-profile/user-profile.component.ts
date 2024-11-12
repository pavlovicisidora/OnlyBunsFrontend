import { Component, OnInit } from '@angular/core';
import { UserProfile } from '../models/user-profile.model';
import { PostAuthoringService } from '../post-authoring.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userProfile: UserProfile | null = null;

  constructor(private route: ActivatedRoute, private postService: PostAuthoringService) {}

  ngOnInit(): void {
    // Uzimamo userId iz URL-a
    const userId = Number(this.route.snapshot.queryParamMap.get('id'));
    
    // Proveravamo da li imamo validan ID i pozivamo servis da dobijemo profil korisnika
    if (userId) {
      this.postService.getUserProfile(userId).subscribe({
        next: (profile) => this.userProfile = profile,
        error: (err) => console.error('Error fetching user profile:', err)
      });
    }
  }
}
