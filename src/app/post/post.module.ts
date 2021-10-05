import { AngularMaterialModule } from './../angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from './../shared/shared.module';
import { PostItemComponent } from './posts-list/post-item/post-item.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { NgModule } from '@angular/core';
import { PostsListComponent } from './posts-list/posts-list.component';
import { AuthGuard } from '../auth/auth.guard';

@NgModule({
  declarations: [CreatePostComponent, PostItemComponent, PostsListComponent],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: PostsListComponent,
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: CreatePostComponent,
      },
      {
        path: 'edit/:id',
        component: CreatePostComponent,
      },
    ]),
  ],
})
export class PostModule {}
