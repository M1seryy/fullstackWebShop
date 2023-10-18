import express, { json } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { registerValidation } from "./validations/auth.js";
import { validationResult } from "express-validator";
import userModel from "./models/User.js";
import bcrypt from "bcrypt";

const app = express();
dotenv.config();
app.use(express.json());

mongoose
  .connect("mongodb+srv://viktor:aletig72@cluster0.woifp57.mongodb.net/")
  .then(() => console.log("Ok mongo"))
  .catch((err) => console.log(err));

app.post("/login/signIn", async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return req.status(404).json({
        message: "Користувача не знайдено",
      });
    }
  } catch (error) {}
});

app.post("/login/register", registerValidation, async (req, res) => {
  try {
    const pass = req.body.password;
    const solt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(pass, solt);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }
    const doc = new userModel({
      fullName: req.body.fullName,
      email: req.body.email,
      passwordHash: hash,
    });

    const user = await doc.save();
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      { expiresIn: "30d" }
    );
    const { passwordHash, ...userData } = user._doc;

    return res.json({
      userData,
      token,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не вдалося створити корстувача",
    });
  }
});
app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server runs on PORT:${process.env.PORT}`);
});
