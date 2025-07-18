import { Student } from '../models/student.model.js';
import { Class } from '../models/class.model.js';
import { School } from '../models/schoolregistration.model.js';
import { generateStudentId } from '../utils/StudentIDGenerator.js';
import User from '../models/users.model.js';
import { generatePassword } from '../utils/passwordGenerator.js';
import { encryptPassword } from '../utils/encryption.js';
import { decryptPassword } from '../utils/encryption.js';

export const getStudentsByFilter = async (req, res) => {
  try {
    const { schoolId, className, section } = req.query;

    if (!schoolId) {
      return res.status(400).json({ message: 'School ID is required' });
    }

    // Find matching class IDs
    let classFilter = { schoolId };
    if (className) classFilter.className = className;
    if (section) classFilter.section = section;

    const classes = await Class.find(classFilter);
    const classIds = classes.map(c => c.classId);

    if (classIds.length === 0) {
      return res.status(404).json({ message: 'No matching classes found' });
    }

    const students = await Student.find({ classId: { $in: classIds }, schoolId });

    // Get passwords from users table
    const userMap = {};
    const usernames = students.map(s => s.studentId);
    const users = await User.find({ username: { $in: usernames } });

    for (const user of users) {
      try {
        userMap[user.username] = decryptPassword(user.password);
      } catch (err) {
        userMap[user.username] = 'Error';
      }
    }

    const result = students.map(s => ({
      ...s._doc,
      password: userMap[s.studentId] || 'Not found'
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error('Filter error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ✅ SINGLE STUDENT REGISTRATION
export const registerStudent = async (req, res) => {
  try {
    const {
      schoolId,
      studentName,
      class: className,
      section,
      rollNo,
      parentName,
      contactNumber
    } = req.body;

    const classDoc = await Class.findOne({ schoolId, className, section });
    if (!classDoc) {
      return res.status(400).json({ message: `Class ${className}-${section} not found in school ${schoolId}` });
    }

    const studentId = await generateStudentId(schoolId, className, rollNo);

    const student = new Student({
      studentId,
      studentName,
      classId: classDoc.classId,
      rollNo,
      parentName,
      contactNumber,
      schoolId
    });

    await student.save();

    const rawPassword = generatePassword();
    const encryptedPassword = encryptPassword(rawPassword);

    await User.create({
      username: studentId,
      password: encryptedPassword,
      userType: 'student'
    });

    res.status(201).json({
      message: 'Student registered successfully',
      student,
      credentials: { username: studentId, password: rawPassword }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// ✅ BULK STUDENT REGISTRATION
export const bulkRegisterStudents = async (req, res) => {
  try {
    const students = req.body.students;

    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ message: 'Invalid or empty student list' });
    }

    const created = [];

    for (const data of students) {
      const schoolId = data.schoolId || data.schoolID || '';
      const studentName = data.studentName || data['Student Name'] || '';
      const className = data.class || data.Class || '';
      const section = data.section || data.Section || '';
      const rollNo = data.rollNo || data['Roll No.'] || '';
      const parentName = data.parentName || data['Parent Name'] || '';
      const contactNumber = data.contactNumber || data['Contact Number'] || '';

      if (!schoolId || !className || !section) {
        throw new Error(`Missing schoolId/class/section for student ${studentName}`);
      }

      const classDoc = await Class.findOne({ schoolId, className, section });
      if (!classDoc) {
        throw new Error(`Class ${className}-${section} not found in school ${schoolId}`);
      }

      const studentId = await generateStudentId(schoolId, className, rollNo);

      const student = new Student({
        studentId,
        studentName,
        classId: classDoc.classId,
        rollNo,
        parentName,
        contactNumber,
        schoolId
      });

      await student.save();

      const rawPassword = generatePassword();
      const encryptedPassword = encryptPassword(rawPassword);

      await User.create({
        username: studentId,
        password: encryptedPassword,
        userType: 'student'
      });

      created.push({ studentId, studentName, password: rawPassword });
    }

    res.status(201).json({
      message: 'Bulk students registered successfully',
      count: created.length,
      students: created
    });
  } catch (err) {
    console.error('Bulk register error:', err);
    res.status(500).json({ message: err.message || 'Internal server error' });
  }
};
