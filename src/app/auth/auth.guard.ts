import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    const isAuth =
      localStorage.getItem('token') && localStorage.getItem('userId')
        ? true
        : false;
    return new Promise((resolve, reject) => {
      if (isAuth) {
        resolve(true);
      } else {
        this.router.navigate(['/auth/signin']);
      }
    });
  }
}
