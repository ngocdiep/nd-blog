import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  isAuthenticated = this.authService.isAuthenticated;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.deleteAuthentication();
    this.router.navigateByUrl('');
  }

}
