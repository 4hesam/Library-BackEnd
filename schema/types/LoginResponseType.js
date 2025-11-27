import { GraphQLObjectType, GraphQLString } from "graphql";
import UserType from "./UserType.js";

export const LoginResponseType = new GraphQLObjectType({
  name: "LoginResponse",
  fields: {
    status: { type: GraphQLString },
    message: { type: GraphQLString },
    user: { type: UserType },
    token: { type: GraphQLString},
  },
});
