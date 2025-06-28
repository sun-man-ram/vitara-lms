import mongoose from 'mongoose';


export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected : ${conn.connection.host}`);
    }
    catch (error){
        console.error(`error msg : ${error.message}`);
        process.exit(1); //1 means exit and 0 means success
    }
}