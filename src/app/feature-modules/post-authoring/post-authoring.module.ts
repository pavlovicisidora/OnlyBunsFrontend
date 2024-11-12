import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostComponent } from './post/post.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { UserProfileComponent } from './user-profile/user-profile.component';



@NgModule({
  declarations: [
    PostComponent,
    PostCreateComponent,
    UserProfileComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
      PostComponent
  ]
})
export class PostAuthoringModule { }
