import express from 'express';
import multer from 'multer';
import { uploadResults, getStudentResults, getPerformanceOverview } from '../controller/uploadResult.controller.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';


const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // temp folder

router.post('/upload', upload.single('file'), uploadResults);
router.get('/results', authenticateUser, getStudentResults);
router.get('/overview', authenticateUser, getPerformanceOverview);

export default router;
