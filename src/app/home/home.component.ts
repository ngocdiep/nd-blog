import { AuthService } from './../shared/services/auth.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.init();
  }

  ngAfterViewInit(): void {
    this.authService.init();
  }
}
