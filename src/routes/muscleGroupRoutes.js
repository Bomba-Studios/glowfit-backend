import { Router } from "express";
import {
  createMuscleGroup,
  getMuscleGroups,
} from "../controllers/muscleGroupController.js";

const router = Router();

router.get("/", getMuscleGroups);
router.post("/", createMuscleGroup);

export default router;
