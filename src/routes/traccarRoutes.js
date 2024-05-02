import express from "express";
const router = express.Router();
import {fromLaravel, fromTraccarData } from "../thirdParty/traccarApiService.js";
import { protect } from "../middleware/authMiddleware.js";
import bodyParser from "body-parser";

router.use(bodyParser.json());
router.use(express.json());

router
    .route("/gettraccardata")
    .get(protect, fromLaravel);
    // .get(protect, traccarData);
    //This route is a GET request that is protected by the protect middleware function.
    //When accessed, it calls the traccarData function, which presumably retrieves data from database from a request:ID.


// Data forwarded by traccar
router 
    .route("/traccarData")
    .post(fromTraccarData);
    ///traccar: This route is a POST request that calls the from TraccarData function when data is sent to it.
    // This function presumably processes data sent from the Traccar API


    
export default router;