import { Directive, AfterViewInit, ElementRef, Input, Component, EventEmitter, Output } from '@angular/core';

import { Observable, Subscription } from 'rxjs/Rx';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/exhaustMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/startWith';
import { AuthService } from './shared/services/auth.service';
import { debounce } from 'rxjs/operators';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { interval } from 'rxjs/observable/interval';
import * as Rx from 'rxjs';

export class ScrollInformation {
  isUp: boolean;
  scrollTopHeight: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'nd blog';
  @Output() scrollInformation$ = new EventEmitter<ScrollInformation>();
  private lastScrollTopHeight = 0;

  constructor(private authService: AuthService) { }

  ngAfterViewInit(): void {
    this.authService.init();
    const scrolls = Rx.Observable.fromEvent(document, 'scroll');
    const result = scrolls.debounce(() => interval(100));

    result.subscribe(x => {
      const scrollInformation = new ScrollInformation();
      scrollInformation.isUp = this.lastScrollTopHeight > window.pageYOffset;
      scrollInformation.scrollTopHeight = window.pageYOffset;
      this.lastScrollTopHeight = window.pageYOffset;

      this.scrollInformation$.emit(scrollInformation);
    });
  }
}
