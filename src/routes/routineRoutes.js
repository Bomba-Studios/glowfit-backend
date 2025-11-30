import express from "express";
import * as routineController from "../controllers/routineController.js";

const router = express.Router();

router.post("/", routineController.createRoutine);
router.get("/user/:userId", routineController.getRoutinesByUser);

export default router;
