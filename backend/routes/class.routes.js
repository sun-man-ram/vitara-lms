import express from 'express';
import { createClass, bulkCreateClasses, getClassesBySchoolId, getClassByClassId } from '../controller/class.controller.js';

const router = express.Router();

router.post('/create', createClass);
router.post('/bulk-create', bulkCreateClasses);
router.get('/by-school/:schoolId', getClassesBySchoolId);
import { authenticateUser } from '../middlewares/auth.middleware.js';

router.get('/:id', getClassByClassId);
export default router;
