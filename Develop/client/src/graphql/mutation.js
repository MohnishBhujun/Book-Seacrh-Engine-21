import { gql } from "@apollo/client";

export const SIGN_UP = gql`
  mutation Signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      token
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export const ADD_BOOK = gql`
  mutation Mutation($bookData: BookInput!) {
    addBook(bookData: $bookData) {
      savedBooks {
        title
      }
    }
  }
`;

export const REMOVE_BOOK = gql`
  mutation Mutation($bookId: String!) {
    removeBook(bookId: $bookId) {
      bookCount
    }
  }
`;
