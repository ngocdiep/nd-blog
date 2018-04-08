import gql from 'graphql-tag';

export const loginQuery = gql`
mutation($email: String!, $password: String!) {
  authenticate(input: {email: $email, password: $password}) {
    clientMutationId
    jwtToken
  }
}
`;


export interface LoginQueryResult {
  authenticate: {
    jwtToken: string;
  };
}
