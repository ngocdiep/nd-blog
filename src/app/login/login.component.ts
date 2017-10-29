import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';


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
    this.authService.login(model).then(
      result =>
        this.router.navigateByUrl('')
    ).catch(error => {
      this.message = error.message;
    });
  }

  ngOnDestroy(): void {
    this.message = null;
    this.model = null;
  }
}
