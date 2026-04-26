import express from "express";
import * as signalController from "../controllers/signalController.js";

const router = express.Router();

router.post("/", signalController.createSignal);
router.get("/", signalController.getAllSignals);
router.get("/:id", signalController.getSignalById);
router.delete("/:id", signalController.deleteSignal);
router.get("/:id/status", signalController.getLiveStatus);

export default router;
