import express from "express";
import {
  createNewCommand,
  createNewGps,
  deleteGps,
  getAllAvailableDevices,
  getAllCommands,
  sendCommandTeltonika,
} from "../controllers/gpsController.js";
import {protect} from "../middleware/authMiddleware.js";
import {createNewGeofence, deleteGeofence, getGeofence, updateGeofence,} from "../controllers/geofence.js";

const router = express.Router();


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


// TODO: TRIP & STOPS route
export default router;
