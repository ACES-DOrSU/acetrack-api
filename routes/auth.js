import express from "express";
import { forgotPassword, login, refreshAccessToken, register, resetPassword, verifyOtp } from "../controller/auth/authController.js";
import {
  loginValidationRules,
  userValidationRules,
  validate,
} from "../middleware/validator.js";
import {authenticate, authorizeRole} from "../middleware/authMiddleware.js";

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

router.post("/forgot-password", express.json(), forgotPassword);
router.post("/reset-password/", express.json(), resetPassword);
router.post("/verify-otp/", express.json(), verifyOtp);
export default router;
