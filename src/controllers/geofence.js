import asyncHandler from "express-async-handler";
import geoFenceModel from "../models/geofenceModel.js";
import { mongoose } from "mongoose";
import gpsModel from "../models/GpsModel.js";
import systemLogs from "../utils/systemLogs.js";
import validateCoordinates from "./validators/geofenceCoordValidate.js";

// @desc get geofences or geofence/:geoId per gps_id
// @route POST /api/gps/geofence or /api/gps/geofence/:geoId
// @access private api key
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
    systemLogs(err);
  }
});

// @desc store new geofences
// @route POST /api/gps/geofence
// @access private api key
const createNewGeofence = async (req, res) => {
  try {
    const { geo_name, gps_id, geo_coord } = req.body;

    const validation = await validateCoordinates(geo_coord.coordinates);
    
    if (!validation.isValid) {
      return res.status(400).json({
        message: validation.message,
      });
    }

    const existingDevice = await gpsModel.findOne({ _id: gps_id }).exec();
    if (!existingDevice) {
      return res.status(409).json({
        message: `Device with id: '${gps_id}' does not exist`,
      });
    }

    const existingGeofence = await geoFenceModel.findOne({ geo_name: geo_name });
    if (existingGeofence) {
      return res.status(409).json({
        message: `Geofence: '${geo_name}' already exists`,
      });
    }

    const newGeofence = new geoFenceModel({
      _id: new mongoose.Types.ObjectId(),
      geo_name,
      gps_id,
      geo_coord: {
        coordinates: validation.correctedCoordinates
      },
    });

    const result = await newGeofence.save();
    systemLogs(`Geofence for gps: ${gps_id} created `);
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
};




// @desc udate geofence
// @route POST /api/gps/geofence/:geoId
// @access private api key
const updateGeofence = asyncHandler(async (req, res) => {
  try {
    const { geoId } = req.query;
    if (!geoId) {
      return res.status(400).json({ message: "geoId parameter is required" });
    }
    const { coordinates } = req.body;
    const existingGeofence = await geoFenceModel.findOne({ _id: geoId }).exec();

    const validation = await validateCoordinates(coordinates);
    
    if (!validation.isValid) {
      return res.status(400).json({
        message: validation.message,
      });
    }
    if (!existingGeofence) {
      return res.status(400).json({
        message: `Geofence id: '${geoId}' does not exist`,
      });
    }

    const updateGeo = {};
    if (coordinates) updateGeo["geo_coord.coordinates"] = validation.correctedCoordinates;
    const result = await geoFenceModel
      .updateOne({ _id: geoId }, { $set: updateGeo })
      .exec();

    if (result.nModified === 0) {
      return res
        .status(400)
        .json({ message: "No geofence found for the provided geoId" });
    }
    systemLogs(`Geofence for Geofence_ID ${geoId} changed `);
    res.status(200).json({
      message: "Geofence updated successfully",
      updatedFields: updateGeo,
    });
  } catch (err) {
    console.error("Error updating geofence:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// @desc delete geofence
// @route POST /api/gps/geofence/:geoId
// @access private api key
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
