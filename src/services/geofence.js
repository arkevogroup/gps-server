import asyncHandler from "express-async-handler";
import geoFenceModel from "../models/geofenceModel.js";
import { mongoose } from "mongoose";
import gpsModel from "../models/GpsModel.js";
import writeLog from "../utils/writeLog.js";

//get geofence by id
const getGeofence = asyncHandler(async (req, res) => {
  try {
    const { geoId } = req.query;

    if (geoId) {
      const doc = await geoFenceModel
        .findOne({ _id: geoId })
        .select("_id geo_name gps_id geo_coord")
        .exec();
      if (!doc) {
        return res.status(404).json({ message: "No geofence found" });
      }
      return res.status(200).json(doc);
    } else {
      const doc = await geoFenceModel.find()
      .select("_id geo_name gps_id geo_coord")
      .exec();
      res.status(200).json({
        count: doc.length,
        geofence: doc,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
    writeLog(err);
  }
});

const createNewGeofence = asyncHandler(async (req, res) => {
  try {
    const {geo_name, gps_id, geo_coord } = req.body;

    const existingDevice = await gpsModel.findOne({ _id: gps_id }).exec();
    if (!existingDevice) {
      return res.status(409).json({
        message: `Device with id: '${gps_id}' does not exist`,
      });
    }

    const newGeofence = new geoFenceModel({
      _id: new mongoose.Types.ObjectId(),
      geo_name,
      gps_id,
      geo_coord,
    });

    const result = await newGeofence.save();
    writeLog(`Geofence for gps: ${gps_id} created `);
    return res.status(201).json({
      message: "Geofence created successfully",
      createdGeofence: result,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: err.message,
    });
  }
});

//update geofence coordinates
const updateGeofence = asyncHandler(async (req, res) => {
  try {
    const { geoId } = req.query;
    if (!geoId) {
      return res.status(400).json({ message: "geoId parameter is required" });
    }
    const { coordinates } = req.body;
    const existingGeofence = await geoFenceModel.findOne({ _id: geoId }).exec();

    if (!existingGeofence) {
      return res.status(400).json({
        message: `Geofence id: '${geoId}' does not exist`,
      });
    }

    const updateGeo = {};
    if (coordinates) updateGeo["geo_coord.coordinates"] = coordinates;
    const result = await geoFenceModel
      .updateOne({ _id: geoId }, { $set: updateGeo })
      .exec();

    if (result.nModified === 0) {
      return res
        .status(400)
        .json({ message: "No geofence found for the provided geoId" });
    }
    writeLog(`Geofence for Geofence_ID ${geoId} changed `);
    res.status(200).json({
      message: "Geofence updated successfully",
      updatedFields: updateGeo,
    });
  } catch (err) {
    console.error("Error updating geofence:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//delete geofence
const deleteGeofence = asyncHandler(async (req, res) => {
  try {
    const { geoId } = req.query;
    console.log(geoId);
    if (!geoId) {
      return res.status(400).json({ message: "geoId parameter is required" });
    }

    const existingGeofence = await geoFenceModel.findOne({ _id: geoId }).exec();
    if (!existingGeofence) {
      return res.status(404).json({ message: "Geofence not found" });
    }

    await geoFenceModel.deleteOne({ _id: geoId }).exec();

    res.status(200).json({ message: `Geofence with id ${geoId} deleted` });
  } catch (error) {
    console.error("Error deleting geofence:", error);
    res.status(500).json({ error: error.message });
  }
});

export { getGeofence, createNewGeofence, updateGeofence, deleteGeofence };
