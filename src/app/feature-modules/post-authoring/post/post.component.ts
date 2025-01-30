import { Component, OnInit, } from '@angular/core';
import { Post } from '../models/post';
import { PostAuthoringService } from '../post-authoring.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../authentication/authentication.service';
import { UserProfile } from '../models/user-profile.model';
import { NgClass } from '@angular/common';
import { popup } from 'leaflet';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  posts: Post[] = [];
  newCommentText: { [postId: number]: string } = {};
  updateFormVisibility: { [postId: number]: boolean } = {}; 
  loggedInUser: UserProfile = { 
    id: 0,
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    postCount: 0,
    followersCount: 0,
    role: { id: 0, name: ''}
  };
  //isLiked: boolean | null = null;
  isCommentsModalOpen = false;
  selectedPost: any = null; 
  usernames: { [userId: number]: string } = {};
  likedPosts: { [postId: number]: boolean } = {};
  imageCache: { [path: string]: string } = {}; // Mapa za keširanje URL-ova slika

  constructor(private service: PostAuthoringService, private router: Router, private userService: AuthenticationService,) {}

  ngOnInit(): void {
    this.loadPosts();
    this.userService.getUserInfo().subscribe({
      next: (loggedInUser) => this.loggedInUser = loggedInUser,
      error: (err) => console.error('Error fetching loggedInUser:', err)
    });

  }

  loadPosts() {
    console.log(this.loggedInUser);
    this.service.getPosts(this.loggedInUser).subscribe({
      next: (posts) => {
        this.posts = posts;
        this.posts.forEach(post => this.loadLikes(post.id)); // Učitaj status za svaki post
        this.posts.forEach(post => this.fetchUsername(post.userId));
        this.posts.forEach(post => {
          if (post.comments && post.comments.length > 0) {
            post.comments.reverse();
          }
        });
      },
      error: (err) => console.error('Error fetching posts:', err),
    });
  }

  fetchUsername(userId: number): void {
    this.service.getUserProfile(userId).subscribe({
      next: (user: UserProfile) => {
        this.usernames[userId] = user.username; 
      },
      error: (err) => console.error('Error fetching user profile:', err)
    });
  }

  getImage(path: string): void {
    console.log(path);
    console.log(this.imageCache);
    if (!this.imageCache[path]) {
      this.service.getImage(path).subscribe(blob => {
        const imageUrl = URL.createObjectURL(blob);
        this.imageCache[path] = imageUrl;
      });
    }
  }


  seeProfile(userId: number) {
    this.router.navigate(['/user-profile'], { queryParams: { id: userId } });
  }

 

  likePost(postId: number) {
    if(this.loggedInUser.role.name === "ROLE_USER"){
     const isLiked = this.likedPosts[postId] || false; // Proverava trenutni status
      this.service.likePost(postId, this.loggedInUser.id).subscribe({
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
    else{
      this.togglePopup(postId);
    }
  }

  loadLikes(postId: number): void {
    this.service.isPostLiked(postId, this.loggedInUser.id).subscribe({
      next: (response: boolean) => {
        this.likedPosts[postId] = response; // Postavi status lajkovanja za post
      },
      error: (err) => console.error('Error checking like status:', err)
    });
  }

  isPostLiked(postId: number): boolean {
    return this.likedPosts[postId] || false; 
  }
  

  addComment(postId: number) {
    const content = this.newCommentText[postId];
    let isCommentable;
  

  /* JAKO JE SPORO, OBO JE DRUGI NACIN KOJI JE IZ NEKOG RAZLOGA JOS SPORIJI 
  
  const currentDate = new Date();
    const oneHourAgo = new Date(currentDate.getTime() - 60 * 60 * 1000);

    let commentsInLastHour = 0;
    for( let post of this.posts){
      for(let comment of post.comments){
         if(comment.userId == this.loggedInUser.id && new Date(comment.createdAt) > oneHourAgo){

          commentsInLastHour++;

      }
    }                         
  } */          

    if (content) {
      this.service.canUserComment(this.loggedInUser.id).subscribe({
        next: (canComment) => {
          if (canComment){
            this.service.addComment(postId, this.loggedInUser.id, content).subscribe({
              next: (newComment) => {
                const post = this.posts.find(post => post.id === postId);
                if (post) {
                  post.comments.unshift(newComment);
                  this.newCommentText[postId] = ''; 
                }
              },
              error: (err) =>{
                alert("You have reached maximum of 5 request per minute. Please wait for your next activity!")
                 console.error('Error adding comment:', err)
              }
            });
          }else{
            alert('You achived maximum of 60 comments per hour!');
          }
        },
        error: (err) => console.error('Error checking if user can comment:', err)
      });
    
      
  }
 }

 popupStates: Map<number, boolean> = new Map();

 togglePopup(postId: number): void {
   const currentState = this.popupStates.get(postId) || false;
   this.popupStates.set(postId, !currentState);
 }
 
 isPopupVisible(postId: number): boolean {
   return this.popupStates.get(postId) || false;
 }




 openCommentsModal(post: any) {
  this.selectedPost = post;
  this.isCommentsModalOpen = true;
}

closeCommentsModal() {
  this.isCommentsModalOpen = false;
  this.selectedPost = null;
}
}