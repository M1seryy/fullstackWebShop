import { body } from "express-validator";

export const registerValidation = [
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
  body("fullName").isLength({ min: 3 }),
  body("avatarUrl").optional().isURL(),
];

export const loginValidation = [
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
];

export const createPostValidation = [
  body("title").isString(),
  body("text").isString({ min: 3 }).isString(),
  body("tags").optional().isArray(),
  body("imageUrl").optional().isString(),
];
