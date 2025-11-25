import { Router } from "express";
import {
  createExercise,
  deleteExercise,
  getExerciseById,
  getExercises,
  updateExercise,
} from "../controllers/exercisesController.js";

const router = Router();

router.get("/", getExercises);
router.get("/:id", getExerciseById);
router.post("/", createExercise);
router.put("/:id", updateExercise);
router.delete("/:id", deleteExercise);

export default router;
