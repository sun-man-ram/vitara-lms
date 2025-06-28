//npm run dev to start application
//actually this is "const express = require('express');" but we used type "module" so we can import like in python

import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import UserRoutes from "./routes/users.routes.js";
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors())


//login post method
app.use('/api/auth', UserRoutes);


//console.log(process.env.MONGO_URI);//this cannot be accesed nrommally thatt is why we are using dotenv package

//setting up port
app.listen(PORT, () => {
    connectDB();
    console.log('Server is running on port 5100 visit : http://localhost:'+ PORT);
})



