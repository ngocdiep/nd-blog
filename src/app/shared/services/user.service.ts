import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user';
import { ApolloQueryResult } from 'apollo-client';

const getUser = gql`
query {
  user {
    email,
    firstName,
    lastName
  }
}`;

export type Query = {
  user: User;
}

@Injectable()
export class UserService {
  userRef: QueryRef<Query>;

  constructor(
    private apollo: Apollo,
    private auth: AuthService
  ) { }

  getUser(): QueryRef<any> {
    console.log('server token: ' + this.auth.getAuthorizationHeader());
    let result: any;
    return this.apollo.watchQuery({
      query: getUser,
    });
  }
}
