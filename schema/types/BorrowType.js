import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";
import UserType from "./UserType.js";
import BookType from "./BookType.js";

const BorrorType = new GraphQLObjectType({
  name: "Borror",
  fields: () => ({
    book: { type: GraphQLNonNull(BookType) },
    user: { type: GraphQLNonNull(UserType) },
    startTime:{ type: GraphQLNonNull(GraphQLString) },
    endTime:{ type: GraphQLNonNull(GraphQLString) },
  }),
});
export default BorrorType;