import express from "express";
import graphqlHTTP from "express-graphql";
import dotenv from "dotenv";
import mongoDB from "./config/db.js";
import { schema } from "./schema/index.js";
import { authMiddleware } from "./middleware/auth.js";

dotenv.config();
mongoDB();
const app = express();

// app.use("/api", authRoutes);

app.use(
  "/graphql",
  graphqlHTTP((req) => {
    const user = authMiddleware(req); // decode JWT

    return {
      schema,
      graphiql: true,
      context: { user }, 
    };
  })
);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}/graphql`)
);
