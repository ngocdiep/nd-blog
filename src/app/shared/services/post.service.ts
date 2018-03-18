import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { Observable } from 'rxjs/Observable';
import gql from 'graphql-tag';

export interface Post {
  node: {
    id;
    headline;
    body;
    userByAuthorId: Owner;
  };
}

export interface Owner {
  id;
  firstName;
  lastName;
}

export interface QueryAllPosts {
  allPosts: {
    edges: [Post]
  };
}

const getPostAll = gql`
query {
  allPosts {
    edges {
      node {
        id
        headline
        body
        authorId
        userByAuthorId {
          firstName
          lastName
        }
      }
    }
  }
}
`;

const getPostById = gql `
query($id: Int!) {
  postById(id: $id) {
    id
    headline
    body
    userByAuthorId {
      firstName
      lastName
    }
  }
}
`;

const create = gql`
mutation($headline: String!, $body: String!){
  createPost(headline: $headline, body: $body) {
    headline
    body,
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

  getPostById(id: string): QueryRef<any> {
    return this.apollo.watchQuery<any>({
      query: getPostById,
      variables: {'id': id}
    });
  }

  create(post) {
    this.apollo.mutate({
      mutation: create,
      variables: post
    }).toPromise().then(rs => console.log(rs));
  }
}
