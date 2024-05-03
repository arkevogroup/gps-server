import * as turf from "@turf/turf";
import fs from "fs";
import geoFenceModel from "../models/geofenceModel.js";

const isInsideGeocode = async (id, location) => {
    // const geofenceCordinates = [
    //   [
    //     [41.4046, 19.7905],
    //     [41.3273, 19.9292],
    //     [41.2665, 19.8715],
    //     [41.316, 19.763],
    //     [41.4046, 19.7905],
    //   ],
    // ];

  try {
    const geofenceData = await geoFenceModel
      .findOne({ gps_id: id })
      .select("_id geo_name gps_id geo_coord")
      .exec();

    if (!geofenceData) {
      console.log(`device ${id} has no geofence zone`);
    }
    const geofenceCordinates = [geofenceData.geo_coord.coordinates];
    //console.log(geofenceCordinate);
    const pt = turf.point(location);
    const poly = turf.polygon(geofenceCordinates);
    const isInsideZone = turf.booleanPointInPolygon(pt, poly);

    if (isInsideZone && geofenceData) {
      console.log(`device ${id} is inside zone ${geofenceData.geo_name}`);
    } else {
      console.log(`device ${id} is outside zone ${geofenceData.geo_name}`);
    }

  } catch (error) {
    return error.message;
  }
};

export { isInsideGeocode };
