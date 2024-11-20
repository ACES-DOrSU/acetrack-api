import express from "express";
import upload from "../middleware/multerConfig.js";
import { authenticate, authorizeRole } from "../middleware/authMiddleware.js";
import {
  getEvents,
  findEvent,
  insertEvent,
  modifyEvent,
  uploadBanner,
  removeEvent,
} from "../controller/event.js";
import { eventValidationRules, validate } from "../middleware/validator.js";

const router = express.Router();

router.post(
  "/event",
  authenticate,
  authorizeRole("admin"),
  express.json(),
  eventValidationRules(),
  validate,
  insertEvent
);
router.get("/event", authenticate, getEvents);
router.get("/event/:id", authenticate, findEvent);
router.patch("/event/:id", authenticate, express.json(), modifyEvent);
router.patch(
  "/event/:id/uploadBanner",
  upload.single("banner"),
  authenticate,
  uploadBanner
);
router.delete("/event/:id", authenticate, removeEvent);
export default router;
