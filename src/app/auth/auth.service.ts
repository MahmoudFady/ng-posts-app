import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly url = 'http://localhost:3000/user/';
  private isAuth$ = new Subject<boolean>();
  private isLoading$ = new Subject<boolean>();
  private errMessage$ = new Subject<string | null>();
  constructor(private http: HttpClient, private router: Router) {}
  private setupAuth(token: string, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    this.isAuth$.next(true);
    this.isLoading$.next(false);
    this.errMessage$.next(null);
    this.router.navigate(['/posts']);
  }
  private clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.isAuth$.next(false);
  }
  signin(email: string, password: string) {
    this.http
      .post<{ token: string; userId: string }>(this.url + 'signin', {
        email,
        password,
      })
      .pipe(delay(2000))
      .subscribe(
        (response) => {
          console.log(response);
          const { token, userId } = response;
          if (token && userId) {
            this.setupAuth(token, userId);
          }
        },
        (err) => {
          this.isLoading$.next(false);
          this.errMessage$.next(err.error.message);
        }
      );
  }
  signup(email: string, password: string) {
    this.http
      .post<{ token: string; userId: string }>(this.url + 'signup', {
        email,
        password,
      })
      .pipe(delay(2000))
      .subscribe(
        (response) => {
          const { token, userId } = response;
          if (token && userId) {
            this.setupAuth(token, userId);
          }
        },
        (err) => {
          this.isLoading$.next(false);
          this.errMessage$.next(err.error.message);
        }
      );
  }
  logout() {
    this.clearAuth();
    this.router.navigate(['/signin']);
  }
  getSavedId() {
    return localStorage.getItem('userId');
  }
  isAuth() {
    return this.isAuth$.asObservable();
  }
  isLoading() {
    return this.isLoading$.asObservable();
  }
  getErorrMessage() {
    return this.errMessage$.asObservable();
  }
}
