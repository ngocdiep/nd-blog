import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { Observable } from 'rxjs/Observable';
import gql from 'graphql-tag';

export interface Post {
  id;
  title;
  description;
  owner: Owner;
}

export interface Owner {
  id;
  email;
}

export interface QueryAllPosts {
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

const create = gql`
mutation($title: String!, $description: String!){
  createPost(title: $title, description: $description) {
    title
    description,
    owner {
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

  create(post) {
    this.apollo.mutate({
      mutation: create,
      variables: post
    }).toPromise().then(rs => console.log(rs));
  }
}
