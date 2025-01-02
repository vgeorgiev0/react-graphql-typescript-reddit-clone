import { gql } from 'urql';

export const GetAllUsers = gql`
  query GetAllUsers {
    allUsers {
      id
      username
      createdAt
      updatedAt
      posts {
        id
        title
        published
      }
    }
  }
`;
