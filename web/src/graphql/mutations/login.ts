import { graphql } from '@/gql';

export const Login = graphql(/* GraphQL */ `
  mutation Login($data: UserRegisterOrLoginInput!) {
    login(data: $data) {
      errors {
        message
        field
      }
      user {
        id
        username
      }
    }
  }
`);
