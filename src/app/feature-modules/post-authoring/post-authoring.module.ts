import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PostComponent } from './post/post.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { FormsModule } from '@angular/forms'; 
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    PostComponent,
    PostCreateComponent,
    UserProfileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule

  ],
  exports: [
    PostComponent,
    PostCreateComponent,
    UserProfileComponent
  ]
})
export class PostAuthoringModule { }