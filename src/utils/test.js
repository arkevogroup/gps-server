import xlsx from "node-xlsx"
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

            device.save();
        })

    } catch (error) {
        console.log(error);
    }
});

export default test
