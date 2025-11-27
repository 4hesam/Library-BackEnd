import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
} from "graphql";
import AuthorType from "./AuthorType.js";
import Author from "../../models/Author.js";

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLNonNull(GraphQLString) },
    inventory: { type: GraphQLNonNull(GraphQLString) },
    author: {
      type: AuthorType,
      resolve: async (book) => await Author.findById(book.authorId),
    },
  }),
});
export default BookType;