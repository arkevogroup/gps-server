import express from "express";
import asyncHandler from "express-async-handler";
import axios from "axios";
import GpsModel from "../models/GpsModel.js";
import { isInsideGeocode } from "../services/geocodeService.js";
import writeLog from "../utils/writeLog.js";
import {register_Device} from './controller/traccar.js';
const app = express();


// Handle data from Traccar server
const fromTraccarData = asyncHandler(async (req, res) => {
  const { device, position } = req.body;

  if (device.status !== "online" || !position?.protocol) return;

  try {
    const { id } = await isRegistered(device?.uniqueId);
    if (!id) {
      writeLog(`${device.name}:${device?.uniqueId} does not exist in the database`);
      return;
    }

    const location = [position.latitude, position.longitude];
    await isInsideGeocode(device?.uniqueId, id, location);
  } catch (error) {
    writeLog(error.message);
  }
});

// Function to check if the device exists in the database
const isRegistered = async (uniqueId) => {
  const existingDevice = await GpsModel.findOne({ imei: uniqueId });
  if (!existingDevice) return { id: null };
  return { id: existingDevice._id.toString() };
};

// Function to forward Traccar data to Laravel
const sendToLaravel = async (data) => {
  const forwardUrl = "http://localhost:3001/callevent";
  try {
    await axios.post(forwardUrl, data, {
      headers: { "Content-Type": "application/json" }
    });
    writeLog("Data sent to Laravel");
  } catch (error) {
    writeLog(error.message);
    throw new Error("Failed to send data to Laravel");
  }
};

// Register new device to Traccar
const createDevice = asyncHandler(async (req, res) => {
  try {
    const device_data = { 
      name: req.body.deviceName,
      uniqueId: req.body.imei
     };
    await register_Device(device_data);
    res.sendStatus(200);
  } catch (error) {
    writeLog(error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});




export {fromTraccarData };
