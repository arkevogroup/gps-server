import mongoose from "mongoose";

const gpsSchema = mongoose.Schema(
  {
    uniqueId: {
      type: String,
      ref: "imei",
      required: true,
      unique: true,
    },
    device_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
    },
    name: {
      type: String,
      required: true,
    },
    bateryLevel: {
      type: String,
    },
    eventtime: {
      eventTime: Date,
    },
    alarm: {
      type: String,
    },
    ignition: {
      type: Boolean,
    },
    rpm: {
      types: String,
    },
    fuel: {
      types: String,
    },
    distance: {
      type: String,
    },
    totalDistance: {
      type: String,
    },
    motion: {
      type: String,
    },
    hours: {
      type: String,
    },
    longitude: {
      type: String,
    },
    latitude: {},
  },
  {
    timestamps: true,
    collection: "traccarGPSData", 
  }
);

const GpsData = mongoose.model("traccarGpsData", gpsSchema);

export default GpsData;
