import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "../schema/typeDefs.js";
import { resolvers } from "../schema/resolvers.js";

export async function setupGraphQL(app) {
  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();

  server.applyMiddleware({ app, path: "/graphql" });

  console.log(`🚀 GraphQL endpoint ready at /graphql`);
}
