import express from 'express';
import cookeiParser from 'cookie-parser';
import dotenv from 'dotenv';
import userRoute from './routes/user.router.js';
import messageRoute from './routes/message.router.js';
import { connectDB } from './lib/db.js';

dotenv.config();
const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cookeiParser());

app.use('/api/v1/auth', userRoute);
app.use('/api/v1/message', messageRoute);

app.listen(port, ()=>{
    console.log(`Server start`);
    connectDB();
});