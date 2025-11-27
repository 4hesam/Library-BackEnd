import { GraphQLObjectType, GraphQLString } from "graphql";
import UserType from "./UserType.js";

export const RegisterResponseType = new GraphQLObjectType({
  name: "RegisterResponse",
  fields: {
    status: { type: GraphQLString },
    message: { type: GraphQLString },
    user: { type: UserType },
    token: { type: GraphQLString},
  },
});
