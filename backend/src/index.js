import express from 'express';
import cors from 'cors';
import cookeiParser from 'cookie-parser';
import dotenv from 'dotenv';
import userRoute from './routes/user.router.js';
import messageRoute from './routes/message.router.js';
import { connectDB } from './lib/db.js';
import { app, serverInstance } from './lib/socket.js';
import path from 'path';

dotenv.config();
const port = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json({ limit: '5mb' }));  // Adjust the limit as needed
// app.use(express.urlencoded({ extended: true, limit: '5mb' }));

app.use(cookeiParser());
app.use(cors({
    origin: "http://localhost:4000", // Replace with your frontend URL
    credentials: true, // Allow cookies and authorization headers
  }));

app.use('/api/v1/auth', userRoute);
app.use('/api/v1/message', messageRoute);

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}
serverInstance.listen(port, ()=>{
    console.log(`Server start`);
    connectDB();
});