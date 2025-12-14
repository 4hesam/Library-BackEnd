import mongoose from "mongoose";
import { type } from "os";

const Book = mongoose.model(
  "Book",
  new mongoose.Schema({
    name: { type: String, required: true },
    inventory: { type: Number, required: true },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: true,
    },
    fileUrl: { type: String },
  })
);

export default Book;
