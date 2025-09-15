import { error } from 'console';
import mongoose from 'mongoose'; 

export const connectDB = async (dburl) => {
    try {
        await mongoose.connect(dburl)
        console.log("DB Connected")
    } catch (error) {
        console.error(error)
        throw error // Re-throw the error to handle it in the calling function
    }
}