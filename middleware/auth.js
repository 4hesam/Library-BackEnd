import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/User.js";

dotenv.config();

export const authMiddleware = async (req) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) return null;

    const token = authHeader.split(" ")[1];

    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    const user = await User.findById(decoded.userId);
    if (!user) return null;
    return user;
  } catch (err) {
    return null;
  }
};
