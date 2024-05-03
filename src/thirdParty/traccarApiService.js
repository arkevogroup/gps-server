import asyncHandler from "express-async-handler";
import { isInsideGeocode } from "../services/geocodeService.js";
import writeLog from "../utils/writeLog.js";
import axios from "axios";

import GpsModel from "../models/GpsModel.js";

// Handle data from Traccar server
//Describe
const fromTraccarData = asyncHandler(async (req, res) => {
  try {
    const body = req.body;
    if (body.device.status === "online" && req.body.position?.protocol) {
      const deviceExists = await isRegistered(body.device?.uniqueId);
      const gps_id = deviceExists.id;
      if (!deviceExists.isRegistered) {
        writeLog(
          `${body.device.name}:${body.device?.uniqueId} do not exist in database`
        );
        return 
      } 
      //console.log(deviceExists);

      const location = [body.position.latitude, body.position.longitude];
      isInsideGeocode(body.device?.uniqueId,gps_id,location);
    }
  } catch (error) {
    writeLog(error.message);
  }
});

// Function to check if the device exists in the database
const isRegistered = async (uniqueId) => {
  const existingDevice = await GpsModel.findOne({ imei: uniqueId });
  const id = existingDevice._id.toString();
  return { isRegistered: !!existingDevice, id: id};
};

// TODO: register device to traccar
const registerDevice = async (body) => {
  const { device, position } = body;
  const newGpsData = new GpsModel({
    name: device.name,
    imei: device.uniqueId,
    protocol: position.protocol,
  });
  await newGpsData.save();

  writeLog(
    `${body.device.name}:${body.device?.uniqueId} registered to database`
  );
};

// Function to forward Traccar data to Laravel
async function sendToLaravel(data) {
  const forwardUrl = "http://localhost:3001/callevent";
  try {
    await axios.post(forwardUrl, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    writeLog("Data sent to Laravel");
  } catch (error) {
    writeLog(error.message);
    throw new Error("Failed to send data to Laravel");
  }
}

const fromLaravel = asyncHandler(async (req, res) => {
  try {
    const id = req.query.id;
    const deviceExist = await GpsModel.findOne({ imei: id });
    if (deviceExist) {
      res.status(200).json(deviceExist);
    } else {
      res
        .status(404)
        .json({
          message: `Device with IMEI=${id} do not exist in traccar server`,
        });
    }
  } catch (error) {
    writeLog(error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

export { fromLaravel, fromTraccarData };
