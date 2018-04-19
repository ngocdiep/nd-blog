import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { NgModule } from '@angular/core';
import { HomeAuthResolver } from './Home-auth-resolver.service';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        resolve: {
            isAuthenticated: HomeAuthResolver
        }
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }
