import express from "express";
import * as routineController from "../controllers/routineController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", routineController.createRoutine);
router.get("/user/:userId", routineController.getRoutinesByUser);
router.post(
  "/generate-ai",
  authenticateToken,
  routineController.generateAIRoutine
);
router.patch(
  "/:id/complete",
  authenticateToken,
  routineController.markRoutineAsCompleted
);

export default router;
