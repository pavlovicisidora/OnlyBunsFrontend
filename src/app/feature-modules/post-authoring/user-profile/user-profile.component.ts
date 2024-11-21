import { Component, OnInit } from '@angular/core';
import { UserProfile } from '../models/user-profile.model';
import { PostAuthoringService } from '../post-authoring.service';
import { ActivatedRoute, Router } from '@angular/router';
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
  followingUsers: UserProfile[] = [];
  isFollowing: boolean = false;
  userId: number = 0;
  
  constructor(
    private route: ActivatedRoute, 
    private postService: PostAuthoringService, 
    private userService: AuthenticationService,
     private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userId = Number(params['id']);
      if (this.userId) {
        this.loadDetails(this.userId);
      }
    });
    this.userService.getUserInfo().subscribe({
      next: (loggedInUser) => this.loggedInUser = loggedInUser,
      error: (err) => console.error('Error fetching loggedInUser:', err)
    });
  }
  loadDetails(userId: number) {
    this.postService.getUserProfile(userId).subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.checkIfFollowing(userId);
        this.loadFollowingUsers(userId);
      },
      error: (err) => console.error('Error fetching user profile:', err)
    });
  }

  seeProfile(userId: number) {
    this.router.navigate(['/user-profile'], { queryParams: { id: userId } });
  }

  loadFollowingUsers(userId: number): void {
    this.postService.getFollowingsAccounts(userId).subscribe({
      next: (users) => this.followingUsers = users,
      error: (err) => console.error('Error fetching following users:', err)
    });
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
          this.loadDetails(this.userId); 
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
          this.loadDetails(this.userId);
        },
        error: (err) => console.error('Error unfollowing user:', err)
      });
    }
  }
}
