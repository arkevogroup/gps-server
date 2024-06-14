import mongoose from "mongoose";

const tripSchema = mongoose.Schema({
    imei: {
        type: String,
    },
    avl_data: {
        type: mongoose.Schema.Types.Mixed
    }
});

const Avl = mongoose.model("Avl_data", tripSchema);

export default Avl;
