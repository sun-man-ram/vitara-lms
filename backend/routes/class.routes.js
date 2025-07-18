import express from 'express';
import { createClass, bulkCreateClasses, getClassesBySchoolId } from '../controller/class.controller.js';

const router = express.Router();

router.post('/create', createClass);
router.post('/bulk-create', bulkCreateClasses);
router.get('/by-school/:schoolId', getClassesBySchoolId);

export default router;
