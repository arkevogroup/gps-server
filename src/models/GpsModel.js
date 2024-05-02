import mongoose, { mongo } from "mongoose";

const gpsSchema = mongoose.Schema(
  {
    imei: {
      type: String,
      required: true,
      unique: true,
    },
    device_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
    },
    alternate_imei: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Gps = mongoose.model("Gps", gpsSchema);

export default Gps;
