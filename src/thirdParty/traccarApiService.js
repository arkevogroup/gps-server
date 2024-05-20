import express from "express";
import asyncHandler from "express-async-handler";
import axios from "axios";
import GpsModel from "../models/GpsModel.js";
import { isInsideGeocode } from "../services/geocodeService.js";
import systemLogs from "../utils/systemLogs.js";
const app = express();


// Handle data from Traccar server
const fromTraccarData = asyncHandler(async (req, res) => {
  const { device, position } = req.body;

  if (device?.status !== "online" || !position?.protocol) return;

  try {
    const { id } = await isRegistered(device?.uniqueId);
    if (!id) {
      systemLogs(`${device.name}:${device?.uniqueId} does not exist in the database`);
      return;
    }

    const location = [position.latitude, position.longitude];
    await isInsideGeocode(device?.uniqueId, id, location);
  } catch (error) {
    systemLogs(error.message);
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
    systemLogs("Data sent to Laravel");
  } catch (error) {
    systemLogs(error.message);
    throw new Error("Failed to send data to Laravel");
  }
};






export {fromTraccarData };
