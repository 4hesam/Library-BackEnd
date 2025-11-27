import Author from "../../models/Author";
import Book from "../../models/Book";

const authorResolver = {
  books: async (author) => await Book.find({ authorId: author.id }),
  authorById: async (parent, args) => await Author.findById(args.id),
  allAuthors: async () => await Author.find(),
};

module.exports = authorResolver;
