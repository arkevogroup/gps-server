import express from "express";
const router = express.Router();
import {
  createNewGps,
  deleteGps,
  createNewCommand,
  getAllCommands,
  getAllAvailableDevices,
  sendCommandTeltonika,
} from "../controllers/gpsController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  getGeofence,
  createNewGeofence,
  updateGeofence,
  deleteGeofence,
} from "../services/geofence.js";


router.route("/store").post(protect, createNewGps);
router.route("/delete/:id").delete(protect, deleteGps);
router.route("/command/store").post(protect, createNewCommand);
router.route("/command/getall").get(protect, getAllCommands);
router.route("/avdevices").get(protect, getAllAvailableDevices);
router.route("/teltonika/sendcommand").post(protect, sendCommandTeltonika);

router.route("/geofence")
    .get(protect, getGeofence)
    .post(protect, createNewGeofence);

router.route("/geofence/:id").patch(protect, updateGeofence);
router.route("/geofence/:id").delete(protect, deleteGeofence);

export default router;
