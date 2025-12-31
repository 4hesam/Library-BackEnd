import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
} from "graphql";

import Author from "../models/Author.js";
import User from "../models/User.js";
import Book from "../models/Book.js";
import AuthorType from "./types/AuthorType.js";
import BookType from "./types/BookType.js";
import UserType from "./types/UserType.js";
import BorrowType from "./types/BorrowType.js";
import Borrow from "../models/Borrow.js";

const BooksPaginationType = new GraphQLObjectType({
  name: "BooksPagination", // must be unique in schema
  fields: () => ({
    books: { type: new GraphQLList(BookType) },
    totalCount: { type: GraphQLInt },
    totalPages: { type: GraphQLInt },
  }),
});

const RootQueryType = new GraphQLObjectType({
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
    Users: {
      type: new GraphQLList(UserType),
      resolve: async () => await User.find(),
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
    me: {
      type: UserType,
      resolve: async (_, __, context) => {
        if (!context.user) {
          throw new Error("Not authenticated");
        }

        const user = await User.findById(context.user._id);

        return user;
      },
    },
    userBorrow: {
      type: new GraphQLList(BorrowType),
      resolve: async (_, __, context) => {
        if (!context.user) {
          throw new Error("User not found");
        }

        const list = await Borrow.find({ user: context.user._id });

        const response = list.map(async (borrow) => {
          return {
            id: borrow._id,
            startTime: `${borrow.startTime}`,
            endTime: `${borrow.endTime}`,
            book: await Book.findById(borrow.book),
          };
        });

        return response;
      },
    },
  }),
});
export default RootQueryType;
