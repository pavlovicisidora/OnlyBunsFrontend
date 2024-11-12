import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostComponent } from './post/post.component';
import { PostCreateComponent } from './post-create/post-create.component';



@NgModule({
  declarations: [
    PostComponent,
    PostCreateComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
      PostComponent
  ]
})
export class PostAuthoringModule { }
