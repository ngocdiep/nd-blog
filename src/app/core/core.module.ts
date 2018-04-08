import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthGuard, UnAuthGuard } from './guards';
import { AuthService, PostService } from './services';
import { DefaultInterceptor } from './interceptors';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
    imports: [
        CommonModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
        AuthService,
        PostService,
        UnAuthGuard,
        AuthGuard
    ],
    declarations: []
})
export class CoreModule { }
