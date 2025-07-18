import express from 'express';
import { schoolregistration } from '../controller/school.controller.js';
import { bulkSchoolRegistration } from '../controller/school.controller.js';
import { getAllSchools } from '../controller/school.controller.js';
import { toggleSchoolStatus } from '../controller/school.controller.js';
import { updateSchool } from '../controller/school.controller.js';


const router=express.Router();
router.post("/schoolregistration",schoolregistration);
router.post("/bulk-register", bulkSchoolRegistration);
router.get('/all', getAllSchools);
router.put('/toggle/:schoolId', toggleSchoolStatus);
router.put('/update/:schoolId', updateSchool);
// router.post("/studentlogin",studentlogin);


export default router;