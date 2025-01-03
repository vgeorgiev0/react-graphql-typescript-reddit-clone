import { gql } from 'urql';

export const Me = gql`
  query Me {
    me {
      errors {
        field
        message
      }
      user {
        createdAt
        id
        updatedAt
        username
      }
    }
  }
`;
