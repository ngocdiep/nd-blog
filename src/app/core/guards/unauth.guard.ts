import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './../services/auth.service';

/* This guard uses to prevent enter a link that only available for the user has not login yet.
For example: if user aready logged in, use this guard to prevent user access to /login, /register,
/changepassword page and redirect to home page. */
@Injectable()
export class UnAuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.authService.getCurrentUser().map(result => {
      if (result && result.data && result.data.currentUser) {
        console.log('already logged in');
        this.router.navigateByUrl('/');
        return false;
      }

      return true;
    });
  }
}
