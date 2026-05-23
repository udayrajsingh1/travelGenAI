import express from "express";
import {
  getMyTrips,
  getTripById,
  deleteTrip,
  toggleFavorite,
} from "../controllers/tripController.js";
import { protect } from "../middleware/authMiddleware.js";
 
const router = express.Router();
 

router.use(protect);
 
router.get("/", getMyTrips);
router.get("/:id", getTripById);
router.delete("/:id", deleteTrip);
router.put("/:id/favorite", toggleFavorite);
 
export default router;
 
