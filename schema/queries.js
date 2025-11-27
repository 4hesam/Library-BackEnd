import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
} from "graphql";

import Author from "../models/Author.js";
import Book from "../models/Book.js";
import AuthorType from "./types/AuthorType.js";
import BookType from "./types/BookType.js";


export const RootQueryType = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    book: {
      type: BookType,
      args: { id: { type: GraphQLNonNull(GraphQLID) } },
      resolve: async (parent, args) => await Book.findById(args.id),
    },
    books: {
      type: new GraphQLList(BookType),
      resolve: async () => await Book.find(),
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLNonNull(GraphQLID) } },
      resolve: async (parent, args) => await Author.findById(args.id),
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve: async () => await Author.find(),
    },
  }),
});

