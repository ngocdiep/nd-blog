import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { AuthService } from './core/services';
import { Router } from '@angular/router';


export class ScrollInformation {
  isUp: boolean;
  scrollTopHeight: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  title = 'nd blog';
  @Output() scrollInformation$ = new EventEmitter<ScrollInformation>();
  private lastScrollTopHeight = 0;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(
      result => {
        if (result && result.data && result.data.currentUser) {
          this.authService.setAuthentication(result.data.currentUser);
        } else {
          console.log('loi thuong: ' + result.errors);
          this.authService.deleteAuthentication();
          this.router.navigateByUrl('/login');
        }
      },
      error => {
        this.authService.deleteAuthentication();
        this.authService.errors.next(error);
        console.log('error: ', error);
        this.router.navigateByUrl('/login');
      }
    );
  }


  ngAfterViewInit(): void {
    const scrolls = fromEvent(document, 'scroll');
    const result = scrolls.debounceTime(100);

    result.subscribe(x => {
      const scrollInformation = new ScrollInformation();
      scrollInformation.isUp = this.lastScrollTopHeight > window.pageYOffset;
      scrollInformation.scrollTopHeight = window.pageYOffset;
      this.lastScrollTopHeight = window.pageYOffset;

      this.scrollInformation$.emit(scrollInformation);
    });
  }
}
