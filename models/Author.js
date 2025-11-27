import mongoose from "mongoose";

const Author = mongoose.model(
  "Author",
  new mongoose.Schema({
    name: { type: String, required: true },
  })
);

export default Author;