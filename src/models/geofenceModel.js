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
    geo_name:{
        type: String
    },
    geo_coord: {
        type: {
            coordinates: [[Number]], 
        },
        required: true,
        _id: false
    }
}, {
    collection: 'Geofence'
});

const GeoFenceModel = mongoose.model('Geofence', geofenceSchema);

export default GeoFenceModel;
