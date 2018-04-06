import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { Observable } from 'rxjs/Observable';
import gql from 'graphql-tag';
import { AuthService } from './auth.service';

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
  allPosts(orderBy: CREATED_AT_DESC) {
    edges {
      node {
        id
        headline
        summary
        authorId
        userByAuthorId {
          fullName
        }
        createdAt
      }
    }
  }
}
`;

const getPostById = gql`
query($id: Int!) {
  postById(id: $id) {
    id
    headline
    body
    createdAt
    userByAuthorId {
      fullName
    }
  }
}
`;

const create = gql`
mutation ($authorId: Int!, $headline: String!, $body: String!) {
  createPost(input: {post: {authorId: $authorId, headline: $headline, body: $body}}) {
    post {
      id
      headline
      userByAuthorId {
        firstName
      }
    }
  }
}
`;

@Injectable()
export class PostService {

  constructor(private apollo: Apollo, private authService: AuthService) { }

  getPostAll(): QueryRef<QueryAllPosts> {
    return this.apollo.watchQuery<QueryAllPosts>({
      query: getPostAll
    });
  }

  getPostById(id: string): QueryRef<any> {
    return this.apollo.watchQuery<any>({
      query: getPostById,
      variables: { 'id': id }
    });
  }

  create(post) {
    this.authService.currentUser.subscribe(val => {
      console.log('id user: ' + val.id);
      post.authorId = val.id;
    });

    return this.apollo.mutate({
      mutation: create,
      variables: post
    });
  }
}
