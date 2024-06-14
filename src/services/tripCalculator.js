import Trip from "../models/tripModel.js";
import connectDB from "../config/database/database.js";
import moment from 'moment';

await connectDB();

function haversineCalc(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRadians(degrees) {
    return degrees * Math.PI / 180;
}

const calculate_trip = async (imei) => {
    try {
        const dateTimeFrom = moment("2024-01-18T15:35:01.000Z");
        const dateTimeTo = moment("2024-01-18T16:01:01.000Z");

        const trips = await Trip.aggregate([
            {
                $match: {
                    imei: imei,
                    timestamp: {
                        $gte: dateTimeFrom.toISOString(),
                        $lte: dateTimeTo.toISOString()
                    }
                }
            }
        ]);

        if (!trips || trips.length === 0) {
            console.log("No trips found for the device with IMEI:", imei);
            return;
        }
        console.log("Trips found for the device with IMEI:", imei);
        let totalDistance = 5000;

        trips.forEach(trip => {
            const tripData = trips.coordinates;
            for (let i = 0; i < tripData.length - 1; i++) {
                const startCoords = tripData[i];
                const endCoords = tripData[i + 1];
                console.log(startCoords,endCoords);
                const distance = haversineCalc(startCoords.latitude, startCoords.longitude, endCoords.latitude, endCoords.longitude);
                totalDistance += distance;
            }
        });

        console.log("Total Distance:", totalDistance, "km");
    } catch (error) {
        console.log("Error:", error);
    }
};





// Assuming haversineCalc function is defined elsewhere

const imeiToFind = 864636061378788;
calculate_trip(imeiToFind);