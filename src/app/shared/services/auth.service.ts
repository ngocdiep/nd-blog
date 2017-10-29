import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/distinctUntilChanged';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../models/user';
import { GraphQLError } from 'graphql';
const AUTH_TOKEN_KEY = 'SCAPHOLD_AUTH_TOKEN';

const login = gql`
mutation ($email: String!, $password: String!) {
  signinUser(email: {email: $email, password: $password}) {
    token,
    user {
      id,
      firstName,
      lastName
    }
  }
}
`;
export interface Error {
  error: any;
  errors: [any];
}
export interface ICredential {
  id: string;
  token: string;
}
export interface IGraphCoolUser {
  firstName: string;
  lastName: string;
}
export interface IGraphCoolSigninUser {
  token: string;
  user: IGraphCoolUser;
}

@Injectable()
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User>(new User());
  public currentUser = this.currentUserSubject.asObservable().distinctUntilChanged();
  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(
    private cookieService: CookieService,
    private apollo: Apollo) { }


  getAuthorizationHeader() {
    console.log('Authorization: ' + this.cookieService.get('Authorization'));
    return this.cookieService.get('Authorization');
  }


  login(credentials) {
    return this.apollo.mutate({
      mutation: login,
      variables: credentials
    }).toPromise().then(rs => {
      const { data } = rs;
      this.setCredential({ token: data['signinUser']['token'], id: data['signinUser']['user']['id'] });
      this.setAuth(data['signinUser']['user']);
      return rs;
    });
  }

  private setCredential(cred: ICredential) {
    localStorage.setItem(AUTH_TOKEN_KEY, cred.token);
    this.cookieService.set('Authorization', cred.token);
  }

  private setAuth(user: User) {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }
}
