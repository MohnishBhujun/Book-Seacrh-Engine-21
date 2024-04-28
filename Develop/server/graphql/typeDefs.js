const { gql } = require("apollo-server-express");

module.exports = gql`
  type Book {
    authors: [String]
    description: String
    bookId: String!
    image: String
    link: String
    title: String!
  }

  type User {
    username: String!
    email: String!
    token: String!
    bookCount: Int
    savedBooks: [Book]!
  }

  input BookInput {
    authors: [String]
    description: String
    bookId: String!
    image: String
    link: String
    title: String!
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): User
    login(email: String!, password: String!): User
    addBook(bookData: BookInput): User
    removeBook(bookId: String!): User
  }

  type Query {
    me: User
    getUserBooks: [Book]
  }
`;
