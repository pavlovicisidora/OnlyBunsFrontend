import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { UserProfile } from '../models/user-profile.model';
import { PostAuthoringService } from '../post-authoring.service';
import { ActivatedRoute } from '@angular/router';
import { RegisteredUser } from '../../administrator/models/registered-user';
import { AuthenticationService } from '../../authentication/authentication.service';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userProfile: UserProfile | null = null;
  
  loggedInUser: RegisteredUser = { 
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    postCount: 0,
    followersCount: 0,
  };
  isFollowing: boolean = false;
  
  constructor(
    private route: ActivatedRoute, 
    private postService: PostAuthoringService, 
    private userService: AuthenticationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDetails();
    this.userService.getUserInfo().subscribe({
      next: (loggedInUser) => this.loggedInUser = loggedInUser,
      error: (err) => console.error('Error fetching loggedInUser:', err)
    });
  }

  loadDetails() {
    // Uzimamo userId iz URL-a
    const userId = Number(this.route.snapshot.queryParamMap.get('id'));
    // Proveravamo da li imamo validan ID i pozivamo servis da dobijemo profil korisnika
    if (userId) {
      this.postService.getUserProfile(userId).subscribe({
        next: (profile) => {
          this.userProfile = profile;

          this.checkIfFollowing(userId);
        },
        error: (err) => console.error('Error fetching user profile:', err)
      });
    }
  }

  checkIfFollowing(userId: number): void {
    this.postService.isFollowingUser(userId).subscribe({
      next: (isFollowing) => this.isFollowing = isFollowing,
      error: (err) => console.error('Error checking follow status:', err)
    });
  }

  toggleFollow(): void {
    if (this.isFollowing) {
      this.unfollowUser();
    } else {
      this.followUser();
    }
  }

  followUser(): void {
    if (this.userProfile) {
      this.postService.followUser(this.userProfile.id).subscribe({
        next: () => {
          this.isFollowing = true; 
          this.loadDetails();
          this.cdr.detectChanges(); 
        },
        error: (err) => console.error('Error following user:', err)
      });
    }
  }

  unfollowUser(): void {
    if (this.userProfile) {
      this.postService.unfollowUser(this.userProfile.id).subscribe({
        next: () => {
          this.isFollowing = false; 
          this.loadDetails();
          this.cdr.detectChanges(); 
        },
        error: (err) => console.error('Error unfollowing user:', err)
      });
    }
  }
}
