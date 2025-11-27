import Book from "../../models/Book.js";
import Author from "../../models/Author.js";

const bookResolver = {
  author: async (book) => await Author.findById(book.authorId),
  bookById: async (parent, args) => await Book.findById(args.id),
  allBooks: async () => await Book.find(),
};

module.exports = bookResolver;
