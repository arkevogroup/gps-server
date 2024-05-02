//import { bool, boolean } from "joi";
import mongoose from "mongoose";

const gpsSchema = mongoose.Schema({
        imei : {
            type : String,
            required : true,
            unique : true
        },
        device_id : {
            type: mongoose.Schema.Types.ObjectId, ref: 'Device'
        },
        alternate_imei : {
            type : String,
            unique : true
        }
    },
    imei: {
      type: String,
      required: true,
      unique: true,
    },
    backup_imei: {
      type: String,
      required: true,
    },
    protocol: {
      type: String,
    },
    device_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
    },
  },
  {
    timestamps: true,
  }
);

const Gps = mongoose.model("Gps", gpsSchema);

export default Gps;
