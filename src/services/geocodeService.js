import * as turf from "@turf/turf";
import geoFenceModel from "../models/geofenceModel.js";

//@desc function is called by fromTraccarData/traccarApiService.js with imei and lat,long coordinates
const isInsideGeocode = async (imei,id, location) => {
  try {
    const geofenceData = await geoFenceModel
      .findOne({ gps_id: id })
      .select("_id geo_name gps_id geo_coord")
      .exec();

    if (!geofenceData) {
      //console.log(`device ${id} has no geofence zone`);
      return;
    }

    const geofenceCoordinates = geofenceData.geo_coord.coordinates;

    const pt = turf.point(location);
    const poly = turf.polygon([geofenceCoordinates]);
    const isInsideZone = turf.booleanPointInPolygon(pt, poly);

    if (isInsideZone && geofenceData) {
      //console.log(`device ${id} is inside zone ${geofenceData.geo_name}`);
     
    } else {
      console.log(`device ${id} is outside zone ${geofenceData.geo_name}`);
      const sos_data = {
        geofence_name: geofenceData.geo_name,
        imei: imei,
        last_location: location,
        time: new Date().toISOString(),
      };
      await laravelCallback(sos_data);
    }
  } catch (error) {
    console.error(error.message);
  }
};

// @desc if (isInsideZone && geofenceData) => false data is forwarded to laravel callback as a sos message
async function laravelCallback(data) {
  try {
    console.log("callback test", data);
    // const response = await fetch('http://localhost/backend/api/sos', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'token'
    //   },
    //   body: JSON.stringify(data),
    // });

    // const responseData = await response.json();
    // console.log(responseData);

    // return responseData;
  } catch (err) {
    console.error(err);
  }
}

export { isInsideGeocode };
