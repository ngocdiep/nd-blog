import { Router } from '@angular/router';
import { Component, OnInit, HostListener, NgZone, ViewChild, Renderer, Input, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ScrollInformation } from '../../../app.component';
import { AuthService } from '../../services/auth.service';


export class SearchForm {
  constructor(public searchString: string) { }
}


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @ViewChild('header') header;
  @Input() direction: Observable<string>;
  @Input() scrollInformation: Observable<ScrollInformation>;
  isAuthenticated = false;

  model: SearchForm = new SearchForm('');

  constructor(private renderer: Renderer, private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.authService.isAuthenticated.subscribe(rs => this.isAuthenticated = rs);

    this.scrollInformation.subscribe(v => {
      if (v.isUp) {
        if (v.scrollTopHeight > 40) {
          this.renderer.setElementClass(this.header.nativeElement, 'top', true);
        } else if (this.header.nativeElement.classList.contains('top')) {
            this.renderer.setElementClass(this.header.nativeElement, 'top', false);
        }
      } else if (v.scrollTopHeight > 60) {
        this.renderer.setElementClass(this.header.nativeElement, 'top', false);
      }
    });
  }

  onSubmit() {
    console.log('searchString: ' + this.model.searchString);
    this.router.navigateByUrl('/search/' + this.model.searchString);
  }

}
