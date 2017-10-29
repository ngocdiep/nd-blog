import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { Observable } from 'rxjs/Observable';
import gql from 'graphql-tag';

export type Post = {
  id;
  title;
  description;
  owner: Owner;
}

export type Owner = {
  id;
  email;
}

export type QueryAllPosts = {
  allPosts: [Post];
}

const getPostAll = gql`
query {
  allPosts {
    id,
    title,
    description,
    owner {
      id,
      email
    }
  }
}
`;
@Injectable()
export class PostService {

  constructor(private apollo: Apollo) { }

  getPostAll(): QueryRef<QueryAllPosts> {
    return this.apollo.watchQuery<QueryAllPosts>({
      query: getPostAll
    });
  }
}
