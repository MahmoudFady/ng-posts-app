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
  subscription: Subscription = new Subscription();
  @Input() post: IPost = {
    _id: '',
    title: '',
    content: '',
    creator: '',
  };
  constructor(
    private authService: AuthService,
    private postService: PostService,
    private modalServie: ModalService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getSavedId()!;
  }
  onDeletePost(id: string) {
    this.modalServie.open();
    this.subscription = this.modalServie
      .getModalResualt()
      .subscribe((okDelete) => {
        if (okDelete) {
          this.postService.deletePostById(id);
        }
        this.subscription.unsubscribe();
      });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
