import mongoose, { mongo } from "mongoose";

const deviceSchema = mongoose.Schema({
        protocol_name : {
            type : String,
            required : true,
            unique : true
        },
        port : {
            type : String,
            required : true,
            unique : true
        }
    },
    {
        timestamps : true
    }
)

deviceSchema.methods.checkDeviceTeltonika = async function () {
    if (this.protocol_name == 'Teltonika')
    return true
}

const DeviceModel = mongoose.model('Device', deviceSchema);

export default DeviceModel;