import express from "express";
const router = express.Router();
import {
  fromTraccarData,
} from "../thirdParty/traccarApiService.js";
import { protect } from "../middleware/authMiddleware.js";
import bodyParser from "body-parser";

router.use(bodyParser.json());
router.use(express.json());

// Data forwarded by traccar
///traccar: This route is a POST request that calls the from TraccarData function when data is sent to it.
// This function presumably processes data sent from the Traccar API
router.route("/traccarData").post(fromTraccarData);


// TODO: Create a device 
//This route is a protected route to handle register device req
//When accessed, it calls the fromLaravel function.
router.route("/traccar")
    .post(protect)
    .get(protect)








export default router;
