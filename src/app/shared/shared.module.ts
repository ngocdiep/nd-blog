import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PostListComponent } from '../post-list/post-list.component';
import { ShowAuthedDirective } from './directives';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ShowAuthedDirective,
        PostListComponent
    ],
    declarations: [
        ShowAuthedDirective,
        PostListComponent
    ]
})
export class SharedModule { }
