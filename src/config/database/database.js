import mongoose from "mongoose";
import { config } from 'dotenv';
import { successCol, errorCol }  from "../../utils/messageColors.js"
import fs from 'fs';
import writeLog from "../../utils/writeLog.js";

config();

const connectDB = async () =>{
    const dburl = "mongodb://192.168.89.50:27017,192.168.89.50:27018,192.168.89.50:27019/?replicaSet=myReplicaSet";

    try {
        // const conn = await mongoose.connect(process.env.MONGO_URI_LOCAL, {
        //     useUnifiedTopology : true,
        //     useNewUrlParser : true,
        // });
        // const conn = await mongoose.connect(process.env.MONGO_URI_LOCAL, {});
        const conn = await mongoose.connect(dburl, {});
        console.log(successCol(`MongoDB Connected : ${conn.connection.host}`));
        writeLog(`MongoDB Connected : ${conn.connection.host}\n-----------------------------`);
    } catch (error) {
        console.error(errorCol(`Error : ${error.message}`));
        writeLog(error);
    }
}

export default connectDB;