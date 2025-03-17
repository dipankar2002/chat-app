import mongoose from 'mongoose';


export const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URL);
    console.log('Mongodb connection successfull', connect.connection.host);
  } catch(err) {
    console.log('MOngodb connection unsccessfull', err);
  }
}