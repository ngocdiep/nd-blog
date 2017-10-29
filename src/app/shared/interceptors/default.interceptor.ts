import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpSentEvent,
    HttpHeaderResponse,
    HttpProgressEvent,
    HttpResponse,
    HttpUserEvent
} from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { isPlatformBrowser } from '@angular/common';
import * as express from 'express';
import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';


@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
    constructor(
        private cookieService: CookieService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
        console.log('intercept...' + this.cookieService.get('Authorization'));
        const request = req.clone({ withCredentials: true });
        const authReq = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + this.cookieService.get('Authorization'))
        });
        return next.handle(authReq);
    }
}
