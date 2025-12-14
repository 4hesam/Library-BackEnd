import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
} from "graphql";

import Author from "../models/Author.js";
import Book from "../models/Book.js";
import AuthorType from "./types/AuthorType.js";
import BookType from "./types/BookType.js";

const BooksPaginationType = new GraphQLObjectType({
  name: "BooksPagination", // must be unique in schema
  fields: () => ({
    books: { type: new GraphQLList(BookType) },
    totalCount: { type: GraphQLInt },
    totalPages: { type: GraphQLInt },
  }),
});

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
    popularBooks: {
      type: new GraphQLList(BookType),
      resolve: async () => await Book.find().limit(5),
    },
    booksPagination: {
      type: BooksPaginationType,
      args: {
        pageOffset: { type: GraphQLNonNull(GraphQLInt) },
        pageSize: { type: GraphQLNonNull(GraphQLInt) },
        search: { type: GraphQLString },
      },

      resolve: async (parent, args) => {
        const { pageOffset = 0, pageSize = 20, search } = args;
        const query = {};
        if (search) {
          query.name = { $regex: search, $options: "i" };
        }
        console.log("Search:", search, "Query:", query);

        const books = await Book.find(query)
          .skip((pageOffset - 1) * pageSize)
          .limit(pageSize);
        const booksCount = await Book.countDocuments(query);
        const response = {
          books,
          totalCount: booksCount,
          totalPages: Math.ceil(booksCount / pageSize),
        };

        return response;
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve: async () => await Author.find(),
    },
  }),
});
