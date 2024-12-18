import { Component, OnInit, } from '@angular/core';
import { Post } from '../models/post';
import { PostAuthoringService } from '../post-authoring.service';
import { Router } from '@angular/router';
import { RegisteredUser } from '../../administrator/models/registered-user';
import { AuthenticationService } from '../../authentication/authentication.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  posts: Post[] = [];
  newCommentText: { [postId: number]: string } = {};
  newPost: { newDescription: string, newImage: string } = {
    newDescription: '',
    newImage: ''
  };
  updateFormVisibility: { [postId: number]: boolean } = {}; 
  loggedInUser: RegisteredUser = { 
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    postCount: 0,
    followersCount: 0,
  };
  isLiked: boolean | null = null;

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
      next: (posts) => this.posts = posts,
      error: (err) => console.error('Error fetching posts:', err)
    });
  }

  seeProfile(userId: number) {
    this.router.navigate(['/user-profile'], { queryParams: { id: userId } });
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
      this.service.updatePost(postId, this.loggedInUser.id, this.newPost.newDescription, this.newPost.newImage).subscribe({
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

  likePost(postId: number) {
      this.isPostLiked(postId);
      this.service.likePost(postId, this.loggedInUser.id).subscribe({
        next: () => {
          const post = this.posts.find(p => p.id === postId);
          if (post && this.isLiked) {
            post.likeCount -= 1;
            this.isLiked = null;
          }
          else if(post && !this.isLiked) {
            post.likeCount += 1;
            this.isLiked = null;
          }
        },
        error: (err) => console.error('Error liking post:', err)
      });
  }

  isPostLiked(postId: number) {
    this.service.isPostLiked(postId, this.loggedInUser.id).subscribe({
      next: (response) => {
        this.isLiked = response;
      },
      error: (err) => console.error('Error liking post:', err)
    });
}
  
  deletePost(postId: number) {
    this.service.deletePost(postId, this.loggedInUser.id).subscribe({
      next: () => {
        this.posts = this.posts.filter(post => post.id !== postId);
      },
      error: (err) => console.error('Error deleting post:', err)
    });
  }

  addComment(postId: number) {
    const content = this.newCommentText[postId];
    if (content) {
      this.service.addComment(postId, this.loggedInUser.id, content).subscribe({
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
}