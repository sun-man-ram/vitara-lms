import express from 'express';
import { registerStudent, bulkRegisterStudents } from '../controller/student.controller.js';
import { getStudentsByFilter, getStudentProfile, getStudentResults, getUpcomingExamsForStudent,getStudentProfilee , getStudentOverview } from '../controller/student.controller.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';
const router = express.Router();

router.post('/register', registerStudent);
router.post('/bulk-register', bulkRegisterStudents);
router.get('/filter', getStudentsByFilter);
//router.get('/:studentId', getStudentProfile);
router.get('/results', authenticateUser, getStudentResults);

router.get('/profile', authenticateUser, getStudentProfilee);
router.get('/overview', authenticateUser, getStudentOverview);

export default router;
