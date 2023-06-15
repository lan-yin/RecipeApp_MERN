import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

// 使用 import 時要將檔案的副檔名打出來
import { userRouter } from "./src/routes/users.js";
import { recipesRouter } from "./src/routes/recipes.js";

const app = express();
dotenv.config();

// turn the data from the front end request into json
// And cors will solve many issues when try to make that API request from the front end
app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);



mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connecting to RecipesAppDB...");
  })
  .catch((e) => {
    console.log(e);
  });

// 3000 will be used by the front end
app.listen(3001, () => console.log("SERVER STARTED! ON PORT 3001!"));
