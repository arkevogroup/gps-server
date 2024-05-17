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
    },
    traccar_dev_id: {
          type: String,
      },
  },
  {
    timestamps: true,
  }
);

const Gps = mongoose.model("Gps", gpsSchema);

export default Gps;
