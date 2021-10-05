import { delay } from 'rxjs/operators';
import { SocketIoService } from './../../shared/socket-io.service';
import { PageEvent } from '@angular/material/paginator';
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
  isLoading = false;
  posts: IPost[] = [];
  totalPosts = 0;
  pageSize = 1;
  subscriptions: Subscription[] = [];
  constructor(
    private postService: PostService,
    private socketIoServie: SocketIoService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts(this.pageSize, 1);
    this.subscriptions[this.subscriptions.length] = this.postService
      .getUpdatedPosts()
      .subscribe((posts) => {
        this.posts = posts;
        this.isLoading = false;
      });
    this.subscriptions[this.subscriptions.length] = this.postService
      .getPostsCount()
      .subscribe((totalPosts) => {
        this.totalPosts = totalPosts;
      });
    this.socketIoServie.joinRoom('posts');
    this.socketIoServie.socketIO.on('onGetPost', (post: IPost) => {
      this.postService.createPost_Client(post);
    });
    this.socketIoServie.socketIO.on('onGetUpdatedPost', (post: IPost) => {
      this.postService.updatePostById_Cleint(post);
    });
    this.socketIoServie.socketIO.on('onGetDeletedPost', (id: string) => {
      this.postService.removePostById_Client(id);
    });
  }
  onPageChanged(pageData: PageEvent) {
    this.isLoading = true;
    const { pageSize, pageIndex } = pageData;
    this.pageSize = pageSize;
    this.postService.getPosts(pageSize, pageIndex + 1);
  }
  ngOnDestroy(): void {
    this.socketIoServie.leaveRoom('posts');
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
