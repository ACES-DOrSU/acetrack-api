import express from "express";

import {authenticate, authorizeRole} from "../middleware/authMiddleware.js";
import { fetchAttendance, fetchEventAttendance, markAttendance } from "../controller/attendance.js";


const router = express.Router();

router.post("/attendance", authenticate, authorizeRole("admin"), express.json(), markAttendance);
router.get("/attendance", authenticate, authorizeRole("admin"), fetchAttendance);
router.get("/event/:id/attendance", authenticate, authorizeRole("admin"), fetchEventAttendance);

export default router;
