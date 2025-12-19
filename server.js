import express from "express";
import graphqlHTTP from "express-graphql";
import dotenv from "dotenv";
import mongoDB from "./config/db.js";
import { schema } from "./schema/index.js";
import { authMiddleware } from "./middleware/auth.js";
import cors from "cors"; 

dotenv.config();
mongoDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:9000',
  credentials: true
}));

app.use(
  "/graphql",
  graphqlHTTP(async (req) => {
    const user = await authMiddleware(req); 

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
