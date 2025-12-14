import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLNonNull,
  GraphQLList,
} from "graphql";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/User.js";
import { RegisterResponseType } from "./types/RegisterResponseType.js";
import { LoginResponseType } from "./types/LoginResponseType.js";
import BookType from "./types/BookType.js";
import AuthorType from "./types/AuthorType.js";
import BorrowType from "./types/BorrowType.js";
import Book from "../models/Book.js";
import Author from "../models/Author.js";
import Borrow from "../models/Borrow.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    register: {
      type: RegisterResponseType,
      args: {
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(_, { username, email, password }) {
        const existingUser = await User.findOne({
          $or: [{ email }, { username }],
        });

        if (existingUser)
          return {
            status: "failure",
            message: "User already exists",
          };
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        const user = { id: newUser._id, username, email };
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
          expiresIn: "2d",
        });
        return {
          status: "Success",
          user,
          message: "create new user",
          token,
        };
      },
    },
    login: {
      type: LoginResponseType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(_, { email, password }) {
        const user = await User.findOne({ email });
        if (!user)
          return {
            status: "failure",
            message: "Invalid credentials",
          };
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
          expiresIn: "2d",
        });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return {
            status: "Error",
            message: "password or email Error",
          };
        }
        if (isMatch) {
          return {
            status: "Success",
            user,
            message: "Wellcome",
            token,
          };
        }
      },
    },
    createBook: {
      type: BookType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLID) },
      },
      async resolve(_, args, context) {
        if (context.user?.role !== "admin") {
          throw new Error("User not found.");
        }

        const book = new Book({
          name: args.name,
          authorId: args.authorId,
        });
        return await book.save();
      },
    },
    createAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, { args }, context) {
        if (!context.user) {
          throw new Error("User not found");
        }

        if (context.user.role !== "admin") {
          throw new Error("You do not have permission to do this.");
        }
        const author = new Author({
          name: args.name,
        });
        return await author.save();
      },
    },
    deleteBook: {
      type: BookType,
      args: {
        id: { type: GraphQLID },
      },
      async resolve(_, { id }, context) {
        if (!context.user) {
          throw new Error("User not found");
        }

        if (context.user.role !== "admin") {
          throw new Error("You do not have permission to do this.");
        }
        const deleted = await Book.findByIdAndDelete(id);
        if (!deleted) throw new Error("Book not found");
        return deleted;
      },
    },
    deleteAuthor: {
      type: AuthorType,
      args: {
        id: { type: GraphQLID },
      },
      async resolve(_, { id }, context) {
        if (!context.user) {
          throw new Error("User not found");
        }

        if (context.user.role !== "admin") {
          throw new Error("You do not have permission to do this.");
        }
        const deleted = await Author.findByIdAndDelete(id);
        if (!deleted) throw new Error("Book not found");
        return deleted;
      },
    },
    borrowBook: {
      type: BorrowType,
      args: {
        bookid: { type: GraphQLID },
        startTime: { type: GraphQLString },
        endTime: { type: GraphQLString },
      },
      async resolve(_, { bookid, startTime, endTime }, context) {
        if (!context.user) {
          throw new Error("User not found");
        }

        const book = await Book.findById(bookid);
        if (!book) {
          throw new Error("book not found");
        }

        if (0 >= book.inventory) throw new Error("book not availble");

        const borrowing = new Borrow({
          user: context.user._id,
          book: bookid,
          startTime,
          endTime,
        });

        return await borrowing.save();
      },
    },
    userBorrow: {
      type: BorrowType,
      async resolve(_, args, context) {
        if (!context.user) {
          throw new Error("User not found");
        }

        return await Borrow.find({ user: context.user._id });
      },
    },
    searchBooks: {
      type: new GraphQLList(BookType), 
      args: {
        keyword: { type: GraphQLNonNull(GraphQLString) }, 
      },
      resolve: async (_, args) => {
        const regex = new RegExp(args.keyword, "i"); 
        return await Book.find({ name: { $regex: regex } });
      },
    },
  },
});
