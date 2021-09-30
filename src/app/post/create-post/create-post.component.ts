import { PostService } from './../post.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.sass'],
})
export class AddPostComponent implements OnInit {
  isLoading = false;
  alerMessageSuccess: string | null = null;
  imagePath: string | null = null;
  postId: string | null = null;
  private subscriptions: Subscription[] = [];
  postForm: FormGroup = new FormGroup({
    title: new FormControl(null, [Validators.required]),
    content: new FormControl(null, [Validators.required]),
    image: new FormControl(null),
  });
  constructor(
    private route: ActivatedRoute,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const id = params['id'];
      this.postId = id ? id : null;
    });
    this.subscriptions[this.subscriptions.length] = this.postService
      .getSuccessMessage()
      .subscribe((msg) => {
        this.alerMessageSuccess = msg;
        this.isLoading = false;
        setTimeout(() => {
          this.alerMessageSuccess = null;
        }, 1200);
      });
    if (this.postId) {
      this.subscriptions[this.subscriptions.length] = this.postService
        .getPostById(this.postId)
        .subscribe((response) => {
          const { title, content, imagePath } = response.post;
          this.postForm.patchValue({
            title,
            content,
          });
          this.imagePath = imagePath!;
        });
    }
  }
  onPickImage(event: Event) {
    this.imagePath = null;
    const input = event.target as HTMLInputElement;
    const file = input.files ? input.files[0] : null;
    this.postForm.patchValue({
      image: file,
    });
    this.postForm.get('image')?.updateValueAndValidity();
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.imagePath = fileReader.result as string;
    };
    if (file) {
      fileReader.readAsDataURL(file as File);
    }
  }
  onSubmit() {
    this.isLoading = true;
    const { title, content, image } = this.postForm.value;
    if (this.postId) {
      this.postService.editPostById(this.postId, title, content, image);
    } else {
      this.postService.createPost(title, content, image);
    }
    this.imagePath = null;
  }
  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
