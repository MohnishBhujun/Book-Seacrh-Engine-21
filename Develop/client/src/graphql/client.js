import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";

const httpLink = new HttpLink({ uri: "https://book-search-90qi.onrender.com/" });

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("id_token");

  operation.setContext({
    headers: {
      authorization: token ? token : "",
    },
  });

  return forward(operation);
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
