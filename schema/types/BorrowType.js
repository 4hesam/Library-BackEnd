import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
} from "graphql";
import UserType from "./UserType.js";
import BookType from "./BookType.js";

const BorrowType = new GraphQLObjectType({
  name: "Borrow",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    book: { type: GraphQLNonNull(BookType) },
    user: { type: GraphQLNonNull(UserType) },
    startTime:{ type: GraphQLNonNull(GraphQLString) },
    endTime:{ type: GraphQLNonNull(GraphQLString) },
  }),
});
export default BorrowType;