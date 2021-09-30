import { delay } from 'rxjs/operators';
import { IPost } from './../shared/post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PostService {
  private readonly url = 'http://localhost:3000/post/';
  private posts: IPost[] = [];
  private updatedPosts = new Subject<IPost[]>();
  private alerMessageSuccess = new Subject<string>();
  constructor(private http: HttpClient) {}
  getAllPosts() {
    this.http
      .get<{ message: string; posts: IPost[] }>(this.url)
      .subscribe((response) => {
        this.posts = response.posts;
        this.updatedPosts.next(this.posts);
      });
  }

  private removePostById_Client(id: string) {
    const index = this.posts.findIndex((post) => post._id == id);
    this.posts.splice(index, 1);
    this.updatedPosts.next(this.posts);
  }
  deletePostById(id: string) {
    this.http.delete(this.url + id).subscribe((message) => {
      console.log(message);
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
      .post<{ message: string }>(this.url, formData)
      .pipe(delay(1000))
      .subscribe((resualt) => {
        this.alerMessageSuccess.next(resualt.message);
      });
  }
  editPostById(id: string, title: string, content: string, image: File) {
    const formData = this.getPostedData(title, content, image);
    this.http
      .put<{ message: string }>(this.url + id, formData)
      .pipe(delay(1000))
      .subscribe((resualt) => {
        this.alerMessageSuccess.next(resualt.message);
      });
  }
  getUpdatedPosts() {
    return this.updatedPosts.asObservable();
  }
  getSuccessMessage() {
    return this.alerMessageSuccess.asObservable();
  }
}
