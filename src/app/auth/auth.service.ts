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
  private authTimer: any;
  constructor(private http: HttpClient, private router: Router) {}
  private doAutoAuth() {
    const savedExpirationDate = localStorage.getItem(
      'expirationDate'
    ) as unknown as Date;
    const expirationDate = new Date(savedExpirationDate).getTime();
    const now = Date.now();
    const expireDuration = expirationDate - now;
    if (expireDuration <= 0) {
      this.logout();
      return;
    }
    this.authTimer = setTimeout(() => {
      this.logout();
    }, expireDuration);
  }
  autoAuth() {
    const savedId = this.getSavedId();
    if (!savedId) {
      return;
    }
    this.doAutoAuth();
  }
  private setupAuthExpiration(duration: number) {
    const expireDate = new Date(Date.now() + duration * 1000).toISOString();
    localStorage.setItem('expirationDate', expireDate);
    this.autoAuth();
  }
  private setupAuth(token: string, userId: string, expireDuration: number) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    this.setupAuthExpiration(expireDuration);
    this.isAuth$.next(true);
    this.isLoading$.next(false);
    this.errMessage$.next(null);
    this.router.navigate(['/posts']);
  }
  private errorSetup(error: any) {
    this.isLoading$.next(false);
    this.errMessage$.next(error.error.message);
  }
  private clearSavedAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expirationDate');
    this.isAuth$.next(false);
  }
  signin(email: string, password: string) {
    this.http
      .post<{ token: string; userId: string; expireDuration: number }>(
        this.url + 'signin',
        {
          email,
          password,
        }
      )
      .pipe(delay(2000))
      .subscribe(
        (response) => {
          const { token, userId, expireDuration } = response;
          if (token && userId) {
            this.setupAuth(token, userId, expireDuration);
          }
        },
        (error) => {
          this.errorSetup(error);
        }
      );
  }
  signup(email: string, password: string) {
    this.http
      .post<{ token: string; userId: string; expireDuration: number }>(
        this.url + 'signup',
        {
          email,
          password,
        }
      )
      .pipe(delay(2000))
      .subscribe(
        (response) => {
          const { token, userId, expireDuration } = response;
          if (token && userId) {
            this.setupAuth(token, userId, expireDuration);
          }
        },
        (error) => {
          this.errorSetup(error);
        }
      );
  }
  logout() {
    this.clearSavedAuth();
    clearTimeout(this.authTimer);
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
