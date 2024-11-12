import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostComponent } from './post/post.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { FormsModule } from '@angular/forms'; 


@NgModule({
  declarations: [
    PostComponent,
    UserProfileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports:[
      PostComponent
  ]
})
export class PostAuthoringModule { }
