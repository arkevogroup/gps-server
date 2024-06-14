import Trip from "../models/tripModel.js";
import haversineCalc from "./tripCalculator.js";
import asyncHandler from "express-async-handler";
import systemLogs from "../utils/systemLogs.js";


//@desc this route handler get trip
//      {
//          "imei": 98198801988198,
//          "page": 2,
//          "pagesize": 13,
//      }
const tripHandler = asyncHandler(async (req, res) => {
    const data = req.body;
    const page = data.page || 1;
    const pageSize = data.page_size || 10;
    const skip = (page - 1) * pageSize;

    try {
        let trips = await Trip.aggregate([
            {
                $match: {
                    imei: data.imei,
                    timestamp: {
                        $gte: data.start_Date.toISOString(),
                        $lte: data.end_Date.toISOString()
                    }
                }
            },
            { $skip: skip },
            {$limit: data.page_size}
        ]);

        if (!trips) {
            return res.status(404).json({
                message: "No trips found for the device with IMEI",
                data: data.imei
            });
        }

        let totalDistance = 0;

        trips.forEach(trip => {
            const tripData = trip.coordinates;
            for (let i = 0; i < tripData.length - 1; i++) {
                const startCoords = tripData[i];
                const endCoords = tripData[i + 1];
                const distance = haversineCalc(startCoords.latitude, startCoords.longitude, endCoords.latitude, endCoords.longitude);
                totalDistance += distance;
            }
        });

        return res.status(200).json({
            message: "Trips found for this device",
            data: {
                trips,
                totalDistance
    }
        });
    } catch (error) {
        systemLogs("Trip Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
});

export default tripHandler;
