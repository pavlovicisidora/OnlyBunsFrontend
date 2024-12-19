import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/feature-modules/authentication/authentication.service';
import { Post } from 'src/app/feature-modules/post-authoring/models/post';
import { UserProfile } from 'src/app/feature-modules/post-authoring/models/user-profile.model';
import { PostAuthoringService } from 'src/app/feature-modules/post-authoring/post-authoring.service';
import { LayoutService } from '../../layout.service';

@Component({
  selector: 'app-trends',
  templateUrl: './trends.component.html',
  styleUrls: ['./trends.component.css']
})
export class TrendsComponent {

  posts: Post[] = [];
  selectedFrame: number = 0; 
  loggedInUser: UserProfile = { 
      id: 0,
      username:'',
      firstName: '',
      lastName: '',
      email: '',
      postCount: 0,
      followersCount: 0,
    };

    users: UserProfile[] = [];
    usernames: { [userId: number]: string } = {};
    likedPosts: { [postId: number]: boolean } = {};
    countOfAllPosts: Number = 0;
    countOfPostsThisMonth: Number = 0;

    isCommentsModalOpen = false;
    selectedPost: any = null; 
    newCommentText: { [postId: number]: string } = {};


     constructor(
        private postService: PostAuthoringService, 
        private service: LayoutService,
        private userService: AuthenticationService,
         private router: Router
      ) {}
    
      ngOnInit(): void {
        this.userService.getUserInfo().subscribe({
          next: (loggedInUser) => {
            this.loggedInUser = loggedInUser;
          },
          error: (err) => console.error('Error fetching loggedInUser:', err)
        });
        this.checkSelectedFrame();

        this.loadNumberOfAllPosts();
        this.loadNumberOfAllPostsThisMonth();
      }




      loadTop5Posts(): void {
        this.service.getTop5PostsIn7Days().subscribe({
          next: (posts) => {
            this.posts = posts;
            this.posts.forEach(post => this.loadLikes(post.id));
            this.posts.forEach(post => this.fetchUsername(post.userId));
          },
          error: (err) => console.error('Error fetching posts:', err)
        });
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
    return this.likedPosts[postId] || false; 
  }

  fetchUsername(userId: number): void {
    this.postService.getUserProfile(userId).subscribe({
      next: (user: UserProfile) => {
        this.usernames[userId] = user.username; 
      },
      error: (err) => console.error('Error fetching user profile:', err)
    });
  }

  seeProfile(userId: number) {
    this.router.navigate(['/user-profile'], { queryParams: { id: userId } });
  }

  loadTop10Posts(): void {
    this.service.getTop10PostsOfAllTime().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.posts.forEach(post => this.loadLikes(post.id));
        this.posts.forEach(post => this.fetchUsername(post.userId));
      },
      error: (err) => console.error('Error fetching posts:', err)
    });
  }

  loadTop10Users(): void {
    this.service.getTop10Users().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (err) => console.error('Error fetching posts:', err)
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


selectFrame(index: number): void {
  this.selectedFrame = index;
  this.checkSelectedFrame();
}


checkSelectedFrame(): void{
  if(this.selectedFrame === 1){
    this.loadTop10Posts();
  }
  else if(this.selectedFrame === 0){
    this.loadTop5Posts();
  }
  else if(this.selectedFrame === 2){
    this.loadTop10Users();
  }
}

loadNumberOfAllPosts(): void {
  this.service.getNumberOfAllPosts().subscribe({
    next: (data) => {
      this.countOfAllPosts = data;
    },
    error: (err) => console.error('Error fetching posts:', err)
  });
}

loadNumberOfAllPostsThisMonth(): void {
  this.service.getNumberOfPostsThisMonth().subscribe({
    next: (data) => {
      this.countOfPostsThisMonth = data;
    },
    error: (err) => console.error('Error fetching posts:', err)
  });
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
