import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { take } from 'rxjs/operators/take';
import { AuthService } from '../core/services';

@Injectable()
export class HomeAuthResolver implements Resolve<boolean> {
    constructor(private authService: AuthService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        console.log('resolve home route...');
        return this.authService.isAuthenticated.pipe(take(1));
    }
}

