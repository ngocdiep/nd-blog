import gql from 'graphql-tag';

export const createPostMutation = gql`
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
