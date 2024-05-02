import asyncHandler from "express-async-handler";
import traccarGFModel from "../models/traccar_geofenceModel.js"; 
import { mongoose } from "mongoose";


//get geofence by id
const getGeofence = asyncHandler(async (req, res) => {
    const id = req.query.params.geoId;
    geofence = traccarGFModel.findById(geoId).exec()
   .then(doc =>{
        if (doc){
            res.status(200).json(doc);
        }
        else{
            res.status(404).json({message: 'No valid entry found for provided ID'});
        }
   })
   .catch(err => {
        res.status(500).json({
            message: 'Get geofence with id ' + id
        }); 
    });
   next();
});

const createNewGeofence = asyncHandler(async (req, res) => {
    try {
        const coord = req.body;
        const existingProduct = await traccarGFModel.findOne({ geoId: req.params.geoId }).exec();
        if (existingProduct) {
            return res.status(409).json({
                message: `geofence with name:'${req.body.name}' already exists`
            });
        } else {
            const tre = new traccarGFModel({
                _id: new mongoose.Types.ObjectId(),
                g1: coord.g1,
                g2: coord.g2,
                g3: coord.g3,
                g4: coord.g4
            });
            const result = await tre.save();

            console.log(result);
            return res.status(201).json({
                message: 'Geofence created successfully',
                createdProduct: result
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err
        });
    }
});

//update geofence
const updateGeofence = asyncHandler(async (req, res) => {
    try {
        const id = req.params.geoId;
        const updateGeo = {};

        for (const ops of req.body){
            updateGeo[ops.change] = ops.newValue;
        }

        const result = await traccarGFModel.updateOne({_id: id}, {$set: updateGeo}).exec();

        res.status(200).json({
            message: 'Product updated',
            request: req.body
        });
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
});


//delete geofence
const deleteGeofence = asyncHandler(async (req, res) => {
    Product.deleteOne({_id: req.params.geoId})
    .exec()
    .then(response => {

        res.status(200).json('Geofence with id ' + req.params.geoId + ' deleted');
    })
    .catch(error => {   
        res.status(500).json({
            error: error
           });
    });
    
    //next();
});


export {
    getGeofence,
    createNewGeofence,
    updateGeofence,
    deleteGeofence,
  };