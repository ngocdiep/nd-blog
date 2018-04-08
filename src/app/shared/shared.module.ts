import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ShowAuthedDirective } from './directives';

@NgModule({
    imports: [
        CommonModule,
    ],
    exports: [
        ShowAuthedDirective
    ],
    declarations: [
        ShowAuthedDirective
    ]
})
export class SharedModule {}
