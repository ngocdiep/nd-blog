import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HomeAuthResolver } from './Home-auth-resolver.service';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

@NgModule({
  imports: [
    SharedModule,
    HomeRoutingModule
  ],
  declarations: [HomeComponent],
  providers: [
    HomeAuthResolver
  ]
})
export class HomeModule { }
