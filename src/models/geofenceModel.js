import mongoose from "mongoose";

const geofenceSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId
    },
    gps_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gps',
        required: true
    },
    geo_coord: {
        type: {
            latitude: { type: [Number], required: true },
            longitude: { type: [Number], required: true }
        },
        _id: false,
        required: true
    }
}, {
    collection: 'Geofence'
});


const GeoFenceModel = mongoose.model('Geofence', geofenceSchema);

export default GeoFenceModel;
