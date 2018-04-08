import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { CookieService } from 'ngx-cookie';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import { CurrentUserQueryResult, LoginQueryResult, currentUserQuery, loginQuery } from '../graphql/query';
import { User, Errors } from '../models';
import { ApolloQueryResult } from 'apollo-client';
const authorization = 'Authorization';


@Injectable()
export class AuthService {

  private currentUserSubject = new BehaviorSubject<User>({} as User);
  public currentUser = this.currentUserSubject.asObservable().distinctUntilChanged();
  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();
  public errors = new BehaviorSubject({} as Errors);
  public securityErrors = this.errors.asObservable().distinctUntilChanged();

  constructor(
    private cookieService: CookieService,
    private apollo: Apollo) {
  }


  getCurrentUser() {
    if (this.getAuthorization()) {
      return this.apollo.query<CurrentUserQueryResult>({
        query: currentUserQuery
      });
    }

    return Observable.of({} as ApolloQueryResult<CurrentUserQueryResult>);
  }


  login(credentials) {
    return this.apollo.mutate<LoginQueryResult>({
      mutation: loginQuery,
      variables: credentials
    });
  }

  setAuthentication(user: User) {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }


  deleteAuthentication() {
    this.currentUserSubject.next({} as User);
    this.isAuthenticatedSubject.next(false);
    this.deleteAuthorization();
  }


  getAuthorization() {
    return this.cookieService.get(authorization);
  }


  setAuthorization(jwtToken: string) {
    this.cookieService.put(authorization, jwtToken);
  }


  private deleteAuthorization() {
    this.cookieService.remove(authorization);
  }
}
