import { SocketIoService } from './../shared/socket-io.service';
import { environment } from 'src/environments/environment';
import { delay } from 'rxjs/operators';
import { IPost } from './../shared/post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PostService {
  private readonly url = environment.BACKEND_URL + 'post/';
  private posts: IPost[] = [];
  private updatedPosts = new Subject<IPost[]>();
  private alerMessageSuccess = new Subject<string>();
  private alertErrorMessage = new Subject<string>();
  private postsCount = 0;
  private updatedPostsCount = new Subject<number>();
  constructor(
    private http: HttpClient,
    private socketIoService: SocketIoService
  ) {}
  getPosts(pageSize: number, currentPage: number) {
    const query = `?pageSize=${pageSize}&currentPage=${currentPage}`;
    this.http
      .get<{ message: string; posts: IPost[]; totalPosts: number }>(
        this.url + query
      )
      .subscribe((response) => {
        this.posts = response.posts;
        this.updatedPosts.next(this.posts);
        this.postsCount = response.totalPosts;
        this.updatedPostsCount.next(this.postsCount);
      });
  }
  updatePostById_Cleint(updatedPost: IPost) {
    const index = this.posts.findIndex((post) => post._id === updatedPost._id);
    this.posts[index] = updatedPost;
    this.updatedPosts.next(this.posts);
  }

  removePostById_Client(id: string) {
    const index = this.posts.findIndex((post) => post._id == id);
    this.posts.splice(index, 1);
    this.updatedPosts.next(this.posts);
    this.postsCount -= 1;
    this.updatedPostsCount.next(this.postsCount);
  }
  createPost_Client(post: IPost) {
    this.posts.push(post);
    this.updatedPosts.next(this.posts);
    this.postsCount += 1;
    this.updatedPostsCount.next(this.postsCount);
  }
  deletePostById(id: string) {
    this.http.delete(this.url + id).subscribe((message) => {
      this.removePostById_Client(id);
    });
  }
  getPostById(id: string) {
    return this.http.get<{ message: string; post: IPost }>(this.url + id);
  }
  private getPostedData(title: string, content: string, image: File) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) {
      formData.append('postImage', image);
    }
    return formData;
  }
  createPost(title: string, content: string, image: File) {
    const formData = this.getPostedData(title, content, image);
    this.http
      .post<{ message: string; post: IPost }>(this.url, formData)
      .pipe(delay(1000))
      .subscribe(
        (resualt) => {
          this.alerMessageSuccess.next(resualt.message);
          this.socketIoService.onCreatePost_Io(resualt.post, 'posts');
        },
        (err) => {
          this.alertErrorMessage.next("cant't create post now");
        }
      );
  }
  editPostById(id: string, title: string, content: string, image: File) {
    const formData = this.getPostedData(title, content, image);
    this.http
      .put<{ message: string; post: IPost }>(this.url + id, formData)
      .pipe(delay(1000))
      .subscribe(
        (resualt) => {
          this.alerMessageSuccess.next(resualt.message);
          this.socketIoService.onUpdatePost_Io(resualt.post, 'posts');
        },
        (err) => {
          this.alertErrorMessage.next("cant't edit post now");
        }
      );
  }
  getUpdatedPosts() {
    return this.updatedPosts.asObservable();
  }
  getSuccessMessage() {
    return this.alerMessageSuccess.asObservable();
  }
  getAlertErrorMessage() {
    return this.alertErrorMessage.asObservable();
  }
  getPostsCount() {
    return this.updatedPostsCount.asObservable();
  }
}
