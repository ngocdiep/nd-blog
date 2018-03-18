import { PostCreateComponent } from './post-create/post-create.component';
import { UnAuthGuard } from './shared/guards/unauth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { PostDetailComponent } from './post-detail/post-detail.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [],
  },
  {
    path: 'home',
    component: HomeComponent,
    children: [],
  },
  {
    path: 'login',
    component: LoginComponent,
    children: [],
    canActivate: [UnAuthGuard]
  },
  {
    path: 'logout',
    component: LogoutComponent,
    children: [],
  },
  {
    path: 'top',
    component: HomeComponent,
    children: [],
  },
  {
    path: 'post/create',
    component: PostCreateComponent,
    children: [],
  },
  {
    path: 'post/:id',
    component: PostDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
