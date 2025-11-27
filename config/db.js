import mongoose from "mongoose";

const mongoDB = () => {
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/books";
  mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.error("MongoDB connection error:", err));
};

export default mongoDB;
