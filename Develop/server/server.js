const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers/resolvers");
const { decodeToken } = require("./utils/tokenUtils");
const MONGODB =
  "mongodb://127.0.0.1:27017/googlebooks" || process.env.MONGODB_URI;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, res }) => {
    if (!req.headers.authorization) {
      return { userData: null };
    }
    const token = req.headers.authorization || "";
    const userData = decodeToken(token);
    return { userData };
  },
});

mongoose
  .connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB Connected");
    return server.listen({ port: 5000 });
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  });
