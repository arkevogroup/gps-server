import asyncHandler from "express-async-handler";
import traccarGps from "./models/traccarGpsData.js";
import writeLog from "../utils/writeLog.js";
import axios from "axios";

// Handle data from Traccar server
const fromTraccarData = asyncHandler(async (req, res) => {
  try {
    const body = req.body;

    if (body.device.status === "online") {
      const deviceExists = await doesDeviceExist(body.device?.uniqueId);

      if (!deviceExists) {
        await registerDevice(body);
      } else {
        writeLog("GPS with provided IMEI exists, forwarding to Laravel");
        sendToLaravel(body);
      }
    }
    res.status(200).send("GPS data received successfully");
  } catch (error) {
    writeLog(error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// Function to check if the device exists in the database
const doesDeviceExist = async (uniqueId) => {
  const existingDevice = await traccarGps.findOne({ imei: uniqueId });
  return !!existingDevice;
};

// Function to register the device in the database
const registerDevice = async (body) => {
  const { device, position } = body;
  const newGpsData = new traccarGps({
    name: device.name,
    imei: device.uniqueId,
    protocol: position.protocol,
  });

  await newGpsData.save();

  writeLog(`Details for ${device?.name} registered to database`);
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
    const deviceExist = await traccarGps.findOne({ imei: id });
    if (deviceExist) {
      res.status(200).json(deviceExist);
    } else {
      res.status(404).json({ message: `Device with IMEI=${id} do not exist in traccar server` });
    }
  } catch (error) {
    writeLog(error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

export { fromLaravel, fromTraccarData };
