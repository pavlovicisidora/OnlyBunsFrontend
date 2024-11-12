import { Component, OnInit } from '@angular/core';
import { Post } from '../models/post';
import { PostAuthoringService } from '../post-authoring.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  posts: Post[] = [];
  newCommentText: { [postId: number]: string } = {};
  userId: number = 0;
  newPost: { showUpdateForm: boolean, newDescription: string, newImage: string } = {
    showUpdateForm: false,
    newDescription: '',
    newImage: ''
  };

  constructor(private service: PostAuthoringService, private router: Router) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts() {
    this.service.getAllPosts().subscribe({
      next: (posts) => this.posts = posts,
      error: (err) => console.error('Error fetching posts:', err)
    });
  }

  seeProfile(userId: number) {
    this.router.navigate(['/user-profile'], { queryParams: { id: userId } });
  }

  toggleUpdateForm(postId: number) {
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      this.newPost.showUpdateForm = !this.newPost.showUpdateForm;
      if (!this.newPost.showUpdateForm) {
        this.newPost.newDescription = '';
        this.newPost.newImage = '';
      }
    }
  }

  updatePost(postId: number, userId: number) {
    if (!userId) {
      alert("Please enter your User ID.");
      return;
    }
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      this.service.updatePost(postId, userId, this.newPost.newDescription, this.newPost.newImage).subscribe({
        next: () => {
          this.newPost.newDescription = '';
          this.newPost.newImage = '';
          this.newPost.showUpdateForm = false; 
        },
        error: (err) => console.error('Error updating post:', err)
      });
    }
  }

  likePost(postId: number, userId: number) {
    if (!userId) {
      alert("Please enter your User ID.");
      return;
    }
    this.service.likePost(postId, userId).subscribe({
      next: () => {
        this.loadPosts();
      },
      error: (err) => console.error('Error liking post:', err)
    });
  }
  
  deletePost(postId: number, userId: number) {
    if (!userId) {
      alert("Please enter your User ID.");
      return;
    }
    this.service.deletePost(postId, userId).subscribe({
      next: () => {
        // Remove the post from the local list immediately
        this.posts = this.posts.filter(post => post.id !== postId);
      },
      error: (err) => console.error('Error deleting post:', err)
    });
  }

  addComment(postId: number, userId: number) {
    if (!userId) {
      alert("Please enter your User ID.");
      return;
    }
    const content = this.newCommentText[postId];
    if (content) {
      this.service.addComment(postId, userId, content).subscribe({
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