import { IPost } from './../../shared/post.model';
import { PostService } from './../post.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.sass'],
})
export class PostsListComponent implements OnInit {
  posts: IPost[] = [];
  subscriptions: Subscription[] = [];
  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.postService.getAllPosts();
    this.subscriptions[this.subscriptions.length] = this.postService
      .getUpdatedPosts()
      .subscribe((posts) => {
        this.posts = posts;
      });
  }
  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
    console.log('destroued');
  }
}
