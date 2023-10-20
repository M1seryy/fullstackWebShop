import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import {
  createPostValidation,
  loginValidation,
  registerValidation,
} from "./validations/auth.js";

import checkAuth from "./middleware/checkAuth.js";
import { authMe, register, signIn } from "./controllers/userCtrl.js";
import { deltePost, getAllPost, getPostById, porsCreate } from "./controllers/PostCtrl.js";

const app = express();
dotenv.config();
app.use(express.json());

mongoose
  .connect("mongodb+srv://viktor:aletig72@cluster0.woifp57.mongodb.net/")
  .then(() => console.log("Ok mongo"))
  .catch((err) => console.log(err));

app.get("/auth/me", checkAuth, authMe);

app.post("/auth/signIn", loginValidation, signIn);

app.post("/auth/register", registerValidation, register);
app.post("/post", checkAuth, createPostValidation, porsCreate);
app.get("/post", getAllPost);
app.delete("/post/:id", deltePost);
app.get("/post/:id",getPostById);

app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server runs on PORT:${process.env.PORT}`);
});
