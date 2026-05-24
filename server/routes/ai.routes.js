

import express from "express";
import { generate } from "../controllers/ai.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();


router.post("/generate", protect, generate);

export default router;