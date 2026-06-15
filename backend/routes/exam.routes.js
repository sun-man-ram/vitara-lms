import express from 'express';
import { createExam, getAllExams, deleteExam, getUpcomingExams } from '../controller/exam.controller.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/create', createExam);
router.get('/all', getAllExams);
router.delete('/delete/:examId', deleteExam);
router.get('/upcoming', authenticateUser, getUpcomingExams);

export default router;
