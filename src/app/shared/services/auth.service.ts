import { Injectable, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/distinctUntilChanged';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../models/user';
import { GraphQLError } from 'graphql';
const authorization = 'Authorization';

const login = gql`
mutation ($email: String!, $password: String!) {
  signinUser(email: {email: $email, password: $password}) {
    token,
    user {
      id,
      email,
      firstName,
      lastName
    }
  }
}
`;

const currentUser = gql`
query {
  user {
    id,
    email,
    firstName,
    lastName
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
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}
export interface IGraphCoolSigninUser {
  token: string;
  user: IGraphCoolUser;
}

export interface QueryUser {
  user: User;
}

@Injectable()
export class AuthService {

  private currentUserSubject = new BehaviorSubject<User>(new User());
  public currentUser = this.currentUserSubject.asObservable().distinctUntilChanged();
  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(
    private cookieService: CookieService,
    private apollo: Apollo) {
  }

  init(): void {
    console.log('init: ' + this.cookieService.get(authorization));
    if (this.cookieService.get(authorization)) {
      this.apollo.query<QueryUser>({
        query: currentUser
      }).map(v => v.data).toPromise().then(rs => {
        console.log('rs: ', rs);
        if (rs.user.email) {
          console.log('logged');
          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(rs.user);
        } else {
          this.isAuthenticatedSubject.next(false);
          this.currentUserSubject.next(new User());
        }
      }).catch(ex => console.log(ex));
    } else {
      this.isAuthenticatedSubject.next(false);
      this.currentUserSubject.next(new User());
    }
  }


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
    localStorage.setItem(authorization, cred.token);
    this.cookieService.set('Authorization', cred.token);
  }

  private clearCredential() {
    localStorage.removeItem(authorization);
    this.cookieService.delete('Authorization');
  }

  private setAuth(user: User) {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  logout() {
    this.currentUserSubject.next(new User);
    this.isAuthenticatedSubject.next(false);
    this.clearCredential();
  }

  ensureLoggedIn(): boolean {
    if (localStorage.getItem(authorization)) {
      // logged in so return true
      return true;
    }
  }
}
