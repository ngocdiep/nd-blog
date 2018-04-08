import gql from 'graphql-tag';
import { User } from '../../models';

export const currentUserQuery = gql`
query {
  currentUser {
    id,
    firstName,
    lastName
  }
}
`;


export interface CurrentUserQueryResult {
  currentUser: User;
}

