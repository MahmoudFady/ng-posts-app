import { ActivatedRoute } from '@angular/router';
import { SocketIoService } from './../../../shared/socket-io.service';
import { ModalService } from './../../../shared/modal/modal.service';
import { PostService } from './../../post.service';
import { AuthService } from './../../../auth/auth.service';
import { IPost } from './../../../shared/post.model';
import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.sass'],
})
export class PostItemComponent implements OnInit {
  userId = '';
  pageSize = 1;
  pageIndex = 1;
  subscription: Subscription = new Subscription();
  @Input() post: IPost = {
    _id: '',
    title: '',
    content: '',
    creator: '',
  };
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private postService: PostService,
    private modalServie: ModalService,
    private socketIoService: SocketIoService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getSavedId()!;
    this.route.queryParams.subscribe((query) => {
      this.pageSize = query['pageSize'];
      this.pageIndex = query['pageIndex'];
    });
  }
  onDeletePost(id: string) {
    this.modalServie.open();
    this.subscription = this.modalServie
      .getModalResualt()
      .subscribe((okDelete) => {
        if (okDelete) {
          this.postService.deletePostById(id);
          this.socketIoService.onDeletePost_Io(id, 'posts');
          this.postService.getPosts(this.pageSize, this.pageIndex);
        }
        this.subscription.unsubscribe();
      });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
