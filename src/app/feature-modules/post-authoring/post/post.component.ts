import { Component, OnInit } from '@angular/core';
import { Post } from '../models/post';
import { PostAuthoringService } from '../post-authoring.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  posts: Post[] = [];

  constructor(private service: PostAuthoringService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts() {
    this.service.getAllPosts().subscribe({
      next: (posts) => this.posts = posts,
      error: (err) => console.error('Error fetching posts:', err)
    });
  }
}
