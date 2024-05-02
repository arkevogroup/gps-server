import mongoose from "mongoose";

const geocodesSchema = new mongoose.Schema({
    device_id : {
        type: mongoose.Schema.Types.ObjectId, ref: 'Device'
    },
    g1: {
        type: String,
        required: true
    },
    g2: {
        type: Number,
        required: true
    },
    g3: {
        type: Number,
        required: true
    },
    g4: {
        type: Number,
        required: true
    },
},
{
    collection: 'traccarGeofence'
});

const traccarGFModel = mongoose.model('traccargeofence', geocodesSchema);

export default traccarGFModel;