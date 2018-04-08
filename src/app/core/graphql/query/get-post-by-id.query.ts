import gql from 'graphql-tag';

export const getPostByIdQuery = gql`
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
