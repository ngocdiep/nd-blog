import { Directive, AfterViewInit, ElementRef, Input, Component, EventEmitter, Output, HostListener } from '@angular/core';

import { Observable, Subscription } from 'rxjs/Rx';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/exhaustMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/startWith';

export class ScrollInformation {
  isUp: boolean;
  scrollTopHeight: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  @Output() scrollInformation$ = new EventEmitter<ScrollInformation>();
  private lastScrollTopHeight = 0;

  constructor() { }

  @HostListener('window:scroll', [])
  private streamScrollEvents() {
    const scrollInformation = new ScrollInformation();
    scrollInformation.isUp = this.lastScrollTopHeight > window.pageYOffset;
    scrollInformation.scrollTopHeight = window.pageYOffset;
    this.lastScrollTopHeight = window.pageYOffset;

    this.scrollInformation$.emit(scrollInformation);
  }
}
