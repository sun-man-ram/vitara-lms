import express from 'express';
import { registerStudent, bulkRegisterStudents } from '../controller/student.controller.js';
import { getStudentsByFilter } from '../controller/student.controller.js';
const router = express.Router();

router.post('/register', registerStudent);
router.post('/bulk-register', bulkRegisterStudents);
router.get('/filter', getStudentsByFilter);

export default router;
