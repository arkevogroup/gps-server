import * as turf from '@turf/turf';
import fs from 'fs';


const isInsideGeocode = () => {
    var geofenceCordinates = [[
        [41.4046 , 19.7905],
        [41.3273 , 19.9292],
        [41.2665 , 19.8715],
        [41.3160 , 19.7630],
        [41.4046 , 19.7905]
    ]];
    
    var lastlocation = [41.3374, 19.8372];

    var pt  = turf.point(lastlocation);
    var poly = turf.polygon(geofenceCordinates); 
    
    return turf.booleanPointInPolygon(pt, poly)
}



const log_json = (log) => {
    fs.appendFile("gps_info.json", JSON.stringify(log)+',', function(err) {
        if (err) {
            console.log(err);
        }
    });
}

export  { isInsideGeocode, log_json }