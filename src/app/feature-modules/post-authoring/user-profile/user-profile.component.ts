import { Component, OnInit } from '@angular/core';
import { UserProfile } from '../models/user-profile.model';
import { PostAuthoringService } from '../post-authoring.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../authentication/authentication.service';
import { Post } from '../models/post';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userProfile: UserProfile | null = null;
  
  loggedInUser: UserProfile = { 
    id: 0,
    username:'',
    firstName: '',
    lastName: '',
    email: '',
    postCount: 0,
    followersCount: 0,
  };
  followingUsers: UserProfile[] = [];
  isFollowing: boolean = false;
  userId: number = 0;
  /********** Posts ***********/
  posts: Post[] = [];
    newCommentText: { [postId: number]: string } = {};
    newPost: { newDescription: string, newImage: string } = {
      newDescription: '',
      newImage: ''
    };
    updateFormVisibility: { [postId: number]: boolean } = {};
    likedPosts: { [postId: number]: boolean } = {};

  /*********************/
  constructor(
    private route: ActivatedRoute, 
    private postService: PostAuthoringService, 
    private userService: AuthenticationService,
     private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getUserInfo().subscribe({
      next: (loggedInUser) => {
        this.loggedInUser = loggedInUser;
        this.route.queryParams.subscribe(params => {
          this.userId = params['id'] ? Number(params['id']) : this.loggedInUser.id;
          this.loadDetails(this.userId);
          this.loadUsersPosts(this.userId);
        });
      },
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
    this.closeFollowingModal();
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


  /////////////// POSTS /////////////////
  loadUsersPosts(userId: number): void {
    this.postService.getAllUsersPosts(userId).subscribe({
      next: (posts) => {
        this.posts = posts;
        this.posts.forEach(post => this.loadLikes(post.id)); // Učitaj status za svaki post
      },
      error: (err) => console.error('Error fetching posts:', err)
    });
  }

  toggleUpdateForm(postId: number) {
    this.updateFormVisibility[postId] = !this.updateFormVisibility[postId];
    if (!this.updateFormVisibility[postId]) {
      this.newPost.newDescription = '';
      this.newPost.newImage = '';
    }
  }

  updatePost(postId: number) {
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      this.postService.updatePost(postId, this.loggedInUser.id, this.newPost.newDescription, this.newPost.newImage).subscribe({
        next: () => {
          post.description = this.newPost.newDescription;
          post.image = this.newPost.newImage;
          this.newPost.newDescription = '';
          this.newPost.newImage = '';
          this.updateFormVisibility[postId] = false;
          this.posts = [...this.posts];
        },
        error: (err) => console.error('Error updating post:', err)
      });
    }
  }

  likePost(postId: number): void {
    const isLiked = this.likedPosts[postId] || false; // Proverava trenutni status
    this.postService.likePost(postId, this.loggedInUser.id).subscribe({
      next: () => {
        const post = this.posts.find(p => p.id === postId);
        if (post) {
          // Menjanje broja lajkova i statusa
          if (isLiked) {
            post.likeCount -= 1;
            this.likedPosts[postId] = false;
          } else {
            post.likeCount += 1;
            this.likedPosts[postId] = true;
          }
        }
      },
      error: (err) => console.error('Error liking post:', err)
    });
  }
  
  loadLikes(postId: number): void {
    this.postService.isPostLiked(postId, this.loggedInUser.id).subscribe({
      next: (response: boolean) => {
        this.likedPosts[postId] = response; // Postavi status lajkovanja za post
      },
      error: (err) => console.error('Error checking like status:', err)
    });
  }

  isPostLiked(postId: number): boolean {
    return this.likedPosts[postId] || false; // Vraća true ako je lajkovan, inače false
  }
  
  deletePost(postId: number) {
    this.postService.deletePost(postId, this.loggedInUser.id).subscribe({
      next: () => {
        this.posts = this.posts.filter(post => post.id !== postId);
      },
      error: (err) => console.error('Error deleting post:', err)
    });
  }

  addComment(postId: number) {
    const content = this.newCommentText[postId];
    if (content) {
      this.postService.addComment(postId, this.loggedInUser.id, content).subscribe({
        next: (newComment) => {
          const post = this.posts.find(post => post.id === postId);
          if (post) {
            post.comments.push(newComment);
            this.newCommentText[postId] = ''; 
          }
        },
        error: (err) => console.error('Error adding comment:', err)
      });
    }
  }

  isPostModalOpen: boolean = false;
  selectedPost: any = null;

  openPostModal(post: any) {
    this.selectedPost = post;
    this.isPostModalOpen = true;
  }

  closePostModal() {
    this.isPostModalOpen = false;
    this.selectedPost = null;
  }

  /////////////// FOLLOWINGS AND FOLLOWERS ////////////////////
  isFollowingModalOpen: boolean = false;

  toggleFollowingModal() {
    this.isFollowingModalOpen = !this.isFollowingModalOpen;
  }

  closeFollowingModal() {
    this.isFollowingModalOpen = false;
  }

}
