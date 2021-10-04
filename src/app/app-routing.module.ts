import { ErrorComponent } from './error/error.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { AddPostComponent } from './post/create-post/create-post.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostsListComponent } from './post/posts-list/posts-list.component';
import { AuthGuard } from './auth/auth.guard';
const routes: Routes = [
  {
    path: '',
    redirectTo: '/posts',
    pathMatch: 'full',
  },
  {
    path: 'posts',
    component: PostsListComponent,
  },
  {
    path: 'create',
    canActivate: [AuthGuard],
    component: AddPostComponent,
  },
  {
    path: 'edit/:id',
    component: AddPostComponent,
  },
  {
    path: 'signin',
    component: SigninComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: '404-page',
    component: ErrorComponent,
  },
  {
    path: '**',
    redirectTo: '/404-page',
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
