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
        const token = this.cookieService.get('Authorization');
        console.log('intercept... ' + token);
        const authReq = req.clone();
        if (token) {
            authReq.headers.set('Authorization', 'Bearer ' + token);
        }

        return next.handle(authReq);
    }
}
