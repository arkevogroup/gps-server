import asyncHandler from "express-async-handler";
import GpsModel from "../models/GpsModel.js";
import DeviceModel from "../models/DeviceModel.js";
import CommandModel from "../models/CommandModel.js";
import {
  createNewGpsValidator,
  createNewCommandValidator,
  sendCommandValidator,
} from "./validators/gpsApiValidator.js";
import { register_Device } from "../thirdParty/controller/traccar.js";

// @desc store new device
// @route POST /api/gps/store
// @access private api key
const createNewGps = asyncHandler(async (req, res) => {
  try {
    const data = await createNewGpsValidator.validateAsync(req.body);
    let checkAllowedDevicesIds = await DeviceModel.findOne({
      _id: data.device_id,
    });
    if (checkAllowedDevicesIds === null) {
      res.status(404).json({ message: "This device id does not exist!" });
      return;
    }

    const gps = new GpsModel({
      imei: data.imei,
      device_id: data.device_id,
      alternate_imei: data.alternate_imei ? data.alternate_imei : null,
    });

    const createdGps = await gps.save();

    const register_traccar = await register_Device(
      createdGps._id,
      createdGps.imei
    );
    let response = {
      message: `GPS device with imei: ${createdGps.imei} was added sucessfully!`,
      data: createdGps,
      traccar_data: register_traccar,
    };

    res.status(200).json(response);
  } catch (error) {
    let response;
    if ((error.code ?? false) && error.code == "11000") {
      response = {
        message: `GPS device with imei: ${error.keyValue.imei} already exists!`,
      };
      res.status(400).json(response);
    } else {
      response = {
        message: error.details ? error.details[0].message : error.message,
      };
      res.status(400).json(response);
    }
  }
});

// @desc store new device
// @route POST /api/gps/command/store
// @access private api key
const createNewCommand = asyncHandler(async (req, res) => {
  try {
    const data = await createNewCommandValidator.validateAsync(req.body);
    let checkAllowedDevicesIds = await DeviceModel.findOne({
      _id: data.device_id,
    });
    if (checkAllowedDevicesIds === null) {
      res.status(404).json({ message: "This device id does not exist!" });
      return;
    }

    const command = new CommandModel({
      command_name: data.command_name,
      command_hex: data.command_hex,
      device_id: data.device_id,
    });

    const createdCommand = await command.save();

    let response = {
      message: `Command: ${createdCommand.command_name} was added sucessfully!`,
      data: createdCommand,
    };

    res.status(200).json(response);
  } catch (error) {
    let response;
    if ((error.code ?? false) && error.code == "11000") {
      response = {
        message: `Command: ${error.keyValue.command_name} already exists!`,
      };
      res.status(400).json(response);
    } else {
      response = {
        message: error.details ? error.details[0].message : error.message,
      };
      res.status(400).json(response);
    }
  }
});

// @desc store new device
// @route POST /api/gps/command/getall
// @access private api key
const getAllCommands = asyncHandler(async (req, res) => {
  try {
    const allCommands = await CommandModel.find(
      {},
      { createdAt: 0, updatedAt: 0, __v: 0 }
    );

    let response = {
      message: `All commands sent successfully!`,
      data: allCommands,
    };

    res.status(200).json(response);
  } catch (error) {
    let response;
    response = {
      message: error.details ? error.details[0].message : error.message,
    };
    res.status(400).json(response);
  }
});

// @desc store new device
// @route POST /api/gps/avdevices
// @access private api key
const getAllAvailableDevices = asyncHandler(async (req, res) => {
  try {
    const allDevices = await DeviceModel.find(
      {},
      { createdAt: 0, updatedAt: 0, __v: 0 }
    );

    let response = {
      message: `All devices sent successfully!`,
      data: allDevices,
    };

    res.status(200).json(response);
  } catch (error) {
    let response;
    response = {
      message: error.details ? error.details[0].message : error.message,
    };
    res.status(400).json(response);
  }
});

// @desc store new device
// @route POST /api/gps/teltonika/sendcommand
// @access private api key
const sendCommandTeltonika = asyncHandler(async (req, res) => {
  try {
    const data = await sendCommandValidator.validateAsync(req.body);
    const gpsDevice = await GpsModel.findOne({ imei: data.imei });
    let device = null;
    let checkDeviceTeltonika = null;
    if (gpsDevice) {
      device = await DeviceModel.findById(gpsDevice.device_id);
      checkDeviceTeltonika = await device.checkDeviceTeltonika();
    }

    if (device && checkDeviceTeltonika) {
      let response = {
        message: `Command ` + data.command + ` in queue!`,
        data: checkDeviceTeltonika,
        queueId: 123,
      };
      res.status(200).json(response);
    } else {
      let response = {
        message: gpsDevice
          ? `Can not send command to a device rather then Teltonika!` +
            (device ? " Device Provided: " + device.protocol_name : "")
          : `GPS with provided imei does not exist!`,
      };
      res.status(400).json(response);
    }
  } catch (error) {
    let response;
    response = {
      message: error.details ? error.details[0].message : error.message,
    };
    res.status(400).json(response);
  }
});

const traccar = asyncHandler(async (req, res) => {
  try {
  } catch (error) {
    let response;
    response = {
      message: error.details ? error.details[0].message : error.message,
    };
    res.status(400).json(response);
  }
});

//modelet e GPS bashk me porten, => getAllCommands dhe createNewCommand me id e modelit te GPS

export {
  createNewGps,
  createNewCommand,
  getAllCommands,
  getAllAvailableDevices,
  sendCommandTeltonika,
  traccar,
};
