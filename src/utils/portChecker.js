import * as xlsx from "node-xlsx"
import asyncHandler from "express-async-handler";

import DeviceModel from "../models/DeviceModel.js";


const test = asyncHandler(async () =>{
    try {
        var obj =  xlsx.parse('./device_port.xlsx')
        obj[0].data.forEach( (data) => {

            let nameUppercase =  data[0][0].toUpperCase() + data[0].slice(1);
            const device = new DeviceModel({
                protocol_name : nameUppercase,
                port : data[1]
            });
            console.log(nameUppercase,data[1]);
            device.save();
        })

    } catch (error) {
        console.log(error);
    }
});

export default test

// import fs from "fs";

// async function device_protocol_type(param_dev_id) {
//   try {
//     if (!fs.existsSync("./devices-port.json")) {
//       throw new Error("JSON file not found");
//     }

//     const data = JSON.parse(fs.readFileSync("./devices-port.json", "utf-8"));

//     const device = data.find(device => device.model === param_dev_id);
//     if (!device) {
//       throw new Error(`Device with ID ${param_dev_id} not found in the JSON file`);
//     }
//     return device

//   } catch (err) {
//     console.error(err);
//     throw err;
//   }
// }

// // Example usage:
// export default device_protocol_type;
