import { SocketIoService } from './../../shared/socket-io.service';
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
  constructor(
    private postService: PostService,
    private socketIoServie: SocketIoService
  ) {}

  ngOnInit(): void {
    this.postService.getAllPosts();
    this.subscriptions[this.subscriptions.length] = this.postService
      .getUpdatedPosts()
      .subscribe((posts) => {
        this.posts = posts;
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
  ngOnDestroy(): void {
    this.socketIoServie.leaveRoom('posts');
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
