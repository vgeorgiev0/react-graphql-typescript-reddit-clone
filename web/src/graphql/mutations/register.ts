import { graphql } from '@/gql';

export const Register = graphql(/* GraphQL */ `
  mutation Register($data: UserRegisterOrLoginInput!) {
    register(data: $data) {
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
