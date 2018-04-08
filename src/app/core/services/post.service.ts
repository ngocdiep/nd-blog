import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { createPostMutation } from '../graphql/mutation';
import { getPostAllQuery, getPostByIdQuery, GetPostAllQueryResult } from '../graphql/query';
import { AuthService } from './auth.service';


@Injectable()
export class PostService {

  constructor(private apollo: Apollo, private authService: AuthService) { }

  getPostAll(): QueryRef<GetPostAllQueryResult> {
    return this.apollo.watchQuery<GetPostAllQueryResult>({
      query: getPostAllQuery
    });
  }

  getPostById(id: string): QueryRef<any> {
    return this.apollo.watchQuery<any>({
      query: getPostByIdQuery,
      variables: { 'id': id }
    });
  }

  create(post) {
    this.authService.currentUser.subscribe(val => {
      console.log('id user: ' + val.id);
      post.authorId = val.id;
    });

    return this.apollo.mutate({
      mutation: createPostMutation,
      variables: post
    });
  }
}
