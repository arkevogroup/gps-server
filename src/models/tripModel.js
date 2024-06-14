import mongoose from "mongoose";

const tripSchema = mongoose.Schema({
    imei: {
        type: mongoose.Schema.Types.ObjectId, ref: "Gps",
    }, timestamp: {
        type: Date, required: true
    }, tripEnd: {
        type: Date,
    },
    coordinates: {
        type: [[Number]]
    },

});

const Trip = mongoose.model("Trip", tripSchema);

export default Trip;
