import gql from 'graphql-tag';
import { Post } from '../../models';

export const getPostAllQuery = gql`
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


export interface PostNode {
  node: Post;
}

export interface GetPostAllQueryResult {
  allPosts: {
    edges: [PostNode]
  };
}
