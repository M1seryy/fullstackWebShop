import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import {
  createPostValidation,
  loginValidation,
  registerValidation,
} from "./validations/auth.js";
import multer from "multer";
import checkAuth from "./middleware/checkAuth.js";
import { authMe, register, signIn } from "./controllers/userCtrl.js";
import {
  deltePost,
  getAllPost,
  getPostById,
  porsCreate,
  updatePost,
} from "./controllers/PostCtrl.js";
import handleVlidationError from "./validations/handleVlidationError.js";

const app = express();
dotenv.config();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_HOST)
  .then(() => console.log("Ok mongo"))
  .catch((err) => console.log(err));

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });
app.use(`/uploads`, express.static("uploads"));

app.get("/auth/me", checkAuth, authMe);
app.post("/auth/signIn", loginValidation, handleVlidationError, signIn);
app.post("/auth/register", registerValidation, handleVlidationError, register);

app.post("/upload", upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.post(
  "/post",
  checkAuth,
  createPostValidation,
  handleVlidationError,
  porsCreate
);
app.get("/post", getAllPost);
app.delete("/post/:id", checkAuth, deltePost);
app.get("/post/:id", checkAuth, getPostById);
app.patch("/post/:id", checkAuth, handleVlidationError, updatePost);

app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server runs on PORT:${process.env.PORT}`);
});
