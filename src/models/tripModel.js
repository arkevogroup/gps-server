import mongoose from "mongoose";

const tripSchema = mongoose.Schema({
    imei: {
        type: mongoose.Schema.Types.Mixed,
        ref: "Gps",
    },
    timestamp: {
        type: String,
        required: true
    },
    coordinates: {
        type: [[Number]],
    }
});

const Trip = mongoose.model("Trip", tripSchema);

export default Trip;
