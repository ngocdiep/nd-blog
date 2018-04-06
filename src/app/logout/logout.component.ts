import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  isAuthenticated = this.authService.isAuthenticated;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.logout();
    this.router.navigateByUrl('');
  }

}
