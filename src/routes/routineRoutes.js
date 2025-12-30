import express from "express";
import * as routineController from "../controllers/routineController.js";

const router = express.Router();

router.post("/", routineController.createRoutine);
router.post("/generate-ai", routineController.generateRoutineAI);
router.get("/user/:userId", routineController.getRoutinesByUser);

export default router;
