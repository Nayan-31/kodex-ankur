import mongoose from 'mongoose';
import config from "./config.js";


async function connectDB() {

    try {
        await mongoose.connect(config.MONGO_URI)
        console.log('Database connected successfully');
    }
    catch (err) {
        console.error('Database connection failed', err);
        process.exit(1);
    }

}

export default connectDB;