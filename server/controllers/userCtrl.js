import userModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

export const register = async (req, res) => {
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
      message: "Невдалося створити корстувача",
    });
  }
};

export const signIn = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: "Користувача не знайдено",
      });
    }
    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );
    if (!isValidPass) {
      return res.status(404).json({
        message: "Логін або пароль невірний",
      });
    }
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      { expiresIn: "30d" }
    );
    const { passwordHash, ...userData } = user._doc;
    console.log(token);
    return res.json({
      userData,
      token,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Невдалося авторизуватися",
    });
  }
};

export const authMe = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "Такого користувача не існує",
      });
    }
    return res.json({
      userData: user,
    });
  } catch (error) {}
};
