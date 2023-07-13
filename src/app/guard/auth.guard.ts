import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../service/api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private service: ApiService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.service.isloggedin()) {
      if (route.url.length > 0) {
        const menu = route.url[0].path;
        if (menu === 'user') {
          if (this.service.getRole() === 'admin') {
            return true;
          } else {
            console.log('You don\'t have access.');
            return this.router.parseUrl('/');
          }
        } else {
          return true;
        }
      } else {
        return true;
      }
    } else {
      console.log('User is not logged in. Redirecting to login page.');
      return this.router.parseUrl('/login');
    }
  }
}
