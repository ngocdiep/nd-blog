import { Injectable, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/distinctUntilChanged';
import { CookieService } from 'ngx-cookie';
import { User } from '../models/user';
import { GraphQLError } from 'graphql';
import 'rxjs/add/observable/of';
import { map, tap } from 'rxjs/operators';
import { concat } from 'rxjs/operator/concat';

const authorization = 'Authorization';

const login = gql`
mutation($email: String!, $password: String!) {
  authenticate(input: {email: $email, password: $password}) {
    clientMutationId
    jwtToken
  }
}
`;

const currentUser = gql`
query {
  currentUser {
    id,
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
  currentUser: User;
}

@Injectable()
export class AuthService {

  private currentUserSubject = new BehaviorSubject<User>(new User());
  public currentUser = this.currentUserSubject.asObservable().distinctUntilChanged();
  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();
  public isLoggedIn = false;

  constructor(
    private cookieService: CookieService,
    private apollo: Apollo) {
    this.isAuthenticatedSubject.asObservable().subscribe(rs => this.isLoggedIn = rs);
  }

  init() {
    console.log('init');

    this.getCurrentUser().subscribe(
      result => {
        if (result.id) {
          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(result);
        } else {
          this.isAuthenticatedSubject.next(false);
          this.currentUserSubject.next(new User());
        }
      }
    );
  }

  getCurrentUser() {
    if (this.getAuthorizationHeader()) {
      return this.apollo.query<QueryUser>({
        query: currentUser
      }).map(result => result.data.currentUser);
    }

    return Observable.of(new User());
  }


  getAuthorizationHeader() {
    return this.cookieService.get('Authorization');
  }


  login(credentials) {
    return this.apollo.mutate({
      mutation: login,
      variables: credentials
    });
  }

  public setCredential(cred: ICredential) {
    this.cookieService.put('Authorization', cred.token);
  }

  private clearCredential() {
    this.cookieService.remove('Authorization');
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
}
