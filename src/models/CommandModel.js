import mongoose, { mongo } from "mongoose";

const commandSchema = mongoose.Schema({
        command_name : {
            type : String,
            required : true,
            unique : true
        },
        command_hex : {
            type : String,
            required: true
        },
        device_id : {
            type: mongoose.Schema.Types.ObjectId, ref: 'Device'
        }
    },
    {
        timestamps : true
    }
)

const Command = mongoose.model('Command', commandSchema);

export default Command;