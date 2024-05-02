import mongoose from "mongoose";

const traccarDataSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    imei: {
        type: String,
        required: true
    },
    protocol:{
        type: String,
        required: true
    }
}, { timestamps: true });

const traccarGps = mongoose.model('traccarGpsData', traccarDataSchema);

export default traccarGps;
