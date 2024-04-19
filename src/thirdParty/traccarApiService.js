import asyncHandler from "express-async-handler";
import GpsData from "./gpsDataModel.js";
import GpsModel from "../models/GpsModel.js";
import { mongoose } from "mongoose";

const fromTraccarData = asyncHandler(async (req, res) => {
  try {
        let {
        batteryLevel,
        alarm,
        ignition,
        rpm,
        fuel,
        distance,
        totalDistance,
        motion,
        hours,
        } = req.body.position.attributes;
    let { name, status, imei } = req.body.device;

    const deviceType = await GpsModel.findOne({ imei: uniqueId });

    if (!deviceType) {
      const filteredData = {
        uniqueId,
        name,
        batteryLevel,
        alarm,
        ignition,
        rpm,
        fuel,
        distance,
        totalDistance,
        motion,
        hours,
        longitude,
        latitude,
      };

      await new GpsData({
        _id: new mongoose.Schema.Types.ObjectId,
        imei: uniqueId,
        name: name,
        batteryLevel: batteryLevel,
        alarm: alarm,
        ignition: ignition,
        rpm: rpm,
        fuelLevel: fuel,
        distance: distance,
        totaldistance: totalDistance,
        motion: motion,
        hours: hours,
        longitude: longtitude,
        latitude: latitude,
      });

      console.log(filteredData);
      res
        .status(200)
        .json({ message: "Data stored successfully", data: filteredData });
      sendToCallbackURL(outData);
    } else {
      res.status(209).json({ message: "GPS with provided IMEI exist" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

async function sendToCallbackURL(outData) {
  const callbackURL = "https://rentout.ai/api/device/imei";
  try {
    const response = await axios.post(callbackURL, outData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
  b;
}

const traccarData = asyncHandler(async (req, res) => {
  try {
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

export { traccarData, fromTraccarData };
