import mongoose from "mongoose";
import 'dotenv/config'
import { successCol, errorCol }  from "../../utils/messageColors.js"

const connectDB = async () =>{
    try {
        // const conn = await mongoose.connect(process.env.MONGO_URI_LOCAL, {
        //     useUnifiedTopology : true,
        //     useNewUrlParser : true,
        // });
        const conn = await mongoose.connect(process.env.MONGO_URI_LOCAL, {});
        console.log(successCol(`MongoDB Connected : ${conn.connection.host}`));
    } catch (error) {
        console.error(errorCol(`Error : ${error.message}`));
    }
}

export default connectDB