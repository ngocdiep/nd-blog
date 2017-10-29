import { Component, OnInit, HostListener, NgZone, ViewChild, Renderer, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ScrollInformation } from '../../../app.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @ViewChild('header') header;
  @Input() direction: Observable<string>;
  @Input() scrollInformation: Observable<ScrollInformation>;

  constructor(private renderer: Renderer) { }

  ngOnInit() {
    this.scrollInformation.subscribe(v => {
      console.log(v.scrollTopHeight);
      if (v.isUp) {
        if (v.scrollTopHeight > 40) {
          this.renderer.setElementClass(this.header.nativeElement, 'top', true);
        } else if (this.header.nativeElement.classList.contains('top')) {
          setTimeout(() => {
            this.renderer.setElementClass(this.header.nativeElement, 'top', false);
          }, 1000 / 60);

        }
      } else if (v.scrollTopHeight > 60) {
        this.renderer.setElementClass(this.header.nativeElement, 'top', false);
      }
    });
  }

}
