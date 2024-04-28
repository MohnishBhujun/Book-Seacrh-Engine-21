import { gql } from "@apollo/client";

export const ME = gql`
  query Me {
    me {
      bookCount
      email
      username
      savedBooks {
        bookId
        authors
        description
        image
        link
        title
      }
    }
  }
`;

export const GET_USER_BOOKS_ID = gql`
  query GetUserBooks {
    getUserBooks {
      bookId
    }
  }
`;
