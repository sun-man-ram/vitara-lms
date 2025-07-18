import express from 'express';
import multer from 'multer';
import { uploadResults } from '../controller/uploadResult.controller.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // temp folder

router.post('/upload', upload.single('file'), uploadResults);

export default router;
