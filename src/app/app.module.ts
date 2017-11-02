import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/layout/header/header.component';
import { FooterComponent } from './shared/layout/footer/footer.component';
import { HomeComponent } from './home/home.component';
import { AuthService } from './shared/services/auth.service';
import { LoginComponent } from './login/login.component';
import { CookieService } from 'ngx-cookie-service';
import { GraphQLModule } from './graphql.module';
import { PostListComponent } from './post-list/post-list.component';
import { PostService } from './shared/services/post.service';
import { LogoutComponent } from './logout/logout.component';
import { ShowAuthedDirective } from './shared/show-authed.directive';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DefaultInterceptor } from './shared/interceptors/default.interceptor';
import { UnAuthGuard } from './shared/guards/unauth.guard';
import { PostCreateComponent } from './post-create/post-create.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    PostListComponent,
    LogoutComponent,
    ShowAuthedDirective,
    PostCreateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    GraphQLModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DefaultInterceptor,
      multi: true,
    },
    AuthService,
    CookieService,
    PostService,
    UnAuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
