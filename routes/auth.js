import express from "express";
import { login, refreshAccessToken, register } from "../controller/auth/authController.js";
import {
  loginValidationRules,
  userValidationRules,
  validate,
} from "../middleware/validator.js";

const router = express.Router();

//login route
router.post("/login", express.json(), loginValidationRules(), validate, login);
//registration route
router.post(
  "/register",
  express.json(),
  userValidationRules(),
  validate,
  register
);

//refresh token
router.post("/refreshToken", refreshAccessToken);

export default router;
