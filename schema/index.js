import { GraphQLSchema } from "graphql";
import  RootQueryType  from "./queries.js";
import { RootMutationType } from "./mutations.js";

export const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});
