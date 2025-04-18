import express from 'express';
import cors from 'cors';
import cookeiParser from 'cookie-parser';
import dotenv from 'dotenv';
import userRoute from './routes/user.router.js';
import messageRoute from './routes/message.router.js';
import { connectDB } from './lib/db.js';
import { app, serverInstance } from './lib/socket.js';

dotenv.config();
const port = process.env.PORT;

app.use(express.json({ limit: '5mb' }));  // Adjust the limit as needed
// app.use(express.urlencoded({ extended: true, limit: '5mb' }));

app.use(cookeiParser());
app.use(cors({
    origin: "http://localhost:4000", // Replace with your frontend URL
    credentials: true, // Allow cookies and authorization headers
  }));

app.use('/api/v1/auth', userRoute);
app.use('/api/v1/message', messageRoute);

serverInstance.listen(port, ()=>{
    console.log(`Server start`);
    connectDB();
});