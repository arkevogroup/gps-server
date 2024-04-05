import express from "express";
const router = express.Router();
import { createNewGps, createNewCommand, getAllCommands, getAllAvailableDevices, sendCommandTeltonika, traccar } from "../controllers/gpsController.js";
import { protect } from "../middleware/authMiddleware.js";


router
    .route("/store")
    .post(protect, createNewGps);

router
    .route("/command/store")
    .post(protect, createNewCommand);

router
    .route("/command/getall")
    .get(protect, getAllCommands);

router
    .route("/avdevices")
    .get(protect, getAllAvailableDevices);

router
    .route("/teltonika/sendcommand")
    .post(protect, sendCommandTeltonika);

router
    .route("/traccar")
    .post(protect, traccar);
export default router;