import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { Observable } from 'apollo-link';


export class LoginForm {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  model: LoginForm;
  message: string;
  error;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.model = new LoginForm();
  }

  onSubmit() {
    if (this.model.email && this.model.password) {
      this.login(this.model);
    }
  }

  login(model: LoginForm): any {
    this.authService.login(model).subscribe(
      result => {
        if (result.errors) {
          this.message = 'errors: ' + result.errors;
          this.authService.deleteAuthentication();
        } else if (result.data && result.data.authenticate) {
          if (result.data.authenticate.jwtToken) {
            this.authService.setAuthorization(result.data.authenticate.jwtToken);
            this.populateLoggedInUser();
          } else {
            this.message = 'Email or password is incorrect';
          }
        }

      },
      (error) => {
        this.message = error.message;
      },
    );
  }

  private populateLoggedInUser() {
    this.authService.getCurrentUser().subscribe(
      result => {
        if (result && result.data && result.data.currentUser) {
          this.authService.setAuthentication(result.data.currentUser);
          this.router.navigateByUrl('');
        } else {
          console.log('loi thuong: ' + result.errors);
          this.authService.deleteAuthentication();
        }
      },
      error => {
        this.authService.deleteAuthentication();
        this.authService.errors.next(error);
        console.log('error: ', error);
      }
    );
  }

  ngOnDestroy(): void {
    this.message = null;
    this.model = null;
  }
}
