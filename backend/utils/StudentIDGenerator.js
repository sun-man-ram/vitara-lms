import { Student } from '../models/student.model.js';
import { Class } from '../models/class.model.js';
import { School } from '../models/schoolregistration.model.js';

export const generateStudentId = async (schoolId, className, rollNo) => {
  // 1. Get schoolCode
  const school = await School.findOne({ schoolId });
  if (!school || !school.schoolCode) {
    throw new Error('Invalid school or schoolCode missing');
  }
  const schoolCode = school.schoolCode;

  // 2. Get class digit
  let classDigit = parseInt(className);
  if (isNaN(classDigit)) throw new Error('Invalid class name');
  if (classDigit === 10) classDigit = 0;

  // 3. Count total students in that school/className (regardless of section)
  const classes = await Class.find({ schoolId, className });
  const classIds = classes.map(c => c.classId);

  const totalStudents = await Student.countDocuments({ classId: { $in: classIds } });

  const studentNumber = (totalStudents + 1).toString().padStart(3, '0');
  const studentId = `${schoolCode}${classDigit}${studentNumber}`;
  return studentId;
};