import express from "express";
import {authenticate, authorizeRole} from "../middleware/authMiddleware.js";
import { getStudents } from "../controller/student.js";

const router = express.Router();

router.get("/students", authenticate, authorizeRole("admin"), getStudents);

export default router;
