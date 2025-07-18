//npm run dev to start application
//actually this is "const express = require('express');" but we used type "module" so we can import like in python

import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import UserRoutes from "./routes/users.routes.js";
import SchoolRoutes from "./routes/school.routes.js";
import ClassRoutes from './routes/class.routes.js';
import StudentRoutes from './routes/student.routes.js';
import ExamRoutes from './routes/exam.routes.js';
import ResultRoutes from './routes/result.routes.js';
import cors from 'cors';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors())

app.use(express.json({ limit: '10mb' })); // You can increase this to '50mb' if needed
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

//login post method
app.use('/api/auth', UserRoutes);


app.use('/api/school',SchoolRoutes);


app.use('/api/class', ClassRoutes);


app.use('/api/student', StudentRoutes);


app.use('/api/exam', ExamRoutes);


app.use('/api/result', ResultRoutes);
//console.log(process.env.MONGO_URI);//this cannot be accesed nrommally thatt is why we are using dotenv package

//setting up port
app.listen(PORT, () => {
    connectDB();
    console.log('Server is running on port 5100 visit : http://localhost:'+ PORT);
})



