import express from "express";
import authenticate from "../middleware/authMiddleware.js";
import { findUser, updateProfile, uploadProfile } from "../controller/user.js";
import upload from "../middleware/multerConfig.js";

const router = express.Router();

router.get("/user", authenticate, findUser);
router.patch(
  "/user/uploadProfilePic",
  upload.single("profilePicture"),
  authenticate,
  uploadProfile
);
router.patch("/user", authenticate, express.json(), updateProfile);

export default router;
