import express from 'express';
import { createExam, getAllExams, deleteExam } from '../controller/exam.controller.js';

const router = express.Router();

router.post('/create', createExam);
router.get('/all', getAllExams);
router.delete('/delete/:examId', deleteExam);

export default router;
