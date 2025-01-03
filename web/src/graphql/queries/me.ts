import { graphql } from '@/gql';

export const Me = graphql(/* GraphQL */ `
  query Me {
    me {
      errors {
        field
        message
      }
      user {
        username
        id
        createdAt
        updatedAt
      }
    }
  }
`);
