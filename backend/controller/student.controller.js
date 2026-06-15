import { Student } from '../models/student.model.js';
import { Class } from '../models/class.model.js';
import { School } from '../models/schoolregistration.model.js';
import { generateStudentId } from '../utils/StudentIDGenerator.js';
import User from '../models/users.model.js';
import { generatePassword } from '../utils/passwordGenerator.js';
import { encryptPassword } from '../utils/encryption.js';
import { decryptPassword } from '../utils/encryption.js';
// controller/result.controller.js
import {ResultMBiPC} from '../models/resultMBiPC.model.js';
import {ResultMPC} from '../models/resultMPC.model.js';
import {ResultMPCAdvanced} from '../models/resultMPCAdvanced.model.js';
import {ResultMBiPCAdvanced} from '../models/resultMBiPCAdvanced.model.js';
import { Exam } from "../models/exam.model.js";


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


// controller/student.controller.js
export const getStudentProfile = async (req, res) => {
  const { studentId } = req.params;
  try {
    const student = await Student.findOne({ studentId }).populate('classId');
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



export const getStudentResults = async (req, res) => {
  const studentId = req.user.username;
  const examId = req.query.examId;

  try {
    if (!examId) {
      return res.status(400).json({ message: 'Missing examId' });
    }

    // Fetch the exam to determine if it's advanced or not
    const exam = await Exam.findOne({ examId });
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    const type = exam.type; // 'mains' or 'advanced'
    const course = exam.course;

    let ResultModel;

    if (/MPC/i.test(course)) {
      ResultModel = type === 'advanced' ? ResultMPCAdvanced : ResultMPC;
    } else if (/MBiPC/i.test(course)) {
      ResultModel = type === 'advanced' ? ResultMBiPCAdvanced : ResultMBiPC;
    } else {
      return res.status(400).json({ message: 'Unsupported course type' });
    }

    const result = await ResultModel.findOne({
      studentId,
      examId,
      status: 'result updated'
    });

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    res.status(200).json(result);

  } catch (err) {
    console.error('🔥 Error fetching result:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// controllers/exam.controller.js


export const getUpcomingExamsForStudent = async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await Student.findOne({ studentId });
    if (!student) return res.status(404).json({ msg: "Student not found" });

    const classDoc = await Class.findOne({ classId: student.classId });
    if (!classDoc) return res.status(404).json({ msg: "Class not found" });

    const course = classDoc.course;
    const today = new Date();

    const exams = await Exam.find({
      course: course,
      date: { $gte: today }
    }).sort({ date: 1 });

    res.status(200).json(exams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching upcoming exams" });
  }
};
export const getStudentProfilee = async (req, res) => {
  try {
    const tokenData = req.user; // from authenticateUser
    const student = await Student.findOne({ studentId: tokenData.username });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Use classId as a custom ID, not MongoDB _id
    const classInfo = await Class.findOne({ classId: student.classId });

    return res.status(200).json({
      studentId: student.studentId,
      studentName: student.studentName,
      schoolId: student.schoolId,
      classId: student.classId,
      className: classInfo?.className,
      section: classInfo?.section,
      course: classInfo?.course,
    });
  } catch (err) {
    console.error("🔥 getStudentProfilee error:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


export const getStudentOverview = async (req, res) => {
  try {
    const studentId = req.user.username;

    // 1. Get student
    const student = await Student.findOne({ studentId });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    // 2. Get class info to know the course
    const classInfo = await Class.findOne({ classId: student.classId });
    if (!classInfo) return res.status(404).json({ error: 'Class not found' });

    const course = classInfo.course;

    // 3. Get all examIds for this course
    const exams = await Exam.find({ course });
    const overviewResults = [];

    for (const exam of exams) {
      let ResultModel;

      if (/MPC/i.test(course)) {
        ResultModel = exam.type === 'advanced' ? ResultMPCAdvanced : ResultMPC;
      } else if (/MBiPC/i.test(course)) {
        ResultModel = exam.type === 'advanced' ? ResultMBiPCAdvanced : ResultMBiPC;
      } else {
        continue;
      }

      const result = await ResultModel.findOne({
        studentId,
        examId: exam.examId,
        status: 'result updated'
      });

      if (result) {
        overviewResults.push(result);
      }
    }

    // No valid results
    if (overviewResults.length === 0) {
      return res.json({
        totalTests: 0,
        averageScore: 0,
        bestSubject: '-',
        weakestSubject: '-',
      });
    }

    // Aggregate results
    let totalScore = 0;
    const subjectTotals = {};

    overviewResults.forEach(result => {
      totalScore += result.total;

      for (const [subject, mark] of Object.entries(result.marks)) {
        if (!subjectTotals[subject]) subjectTotals[subject] = [];
        subjectTotals[subject].push(mark);
      }
    });

    const averageScore = (totalScore / overviewResults.length).toFixed(2);

    const subjectAverages = Object.entries(subjectTotals).map(([subject, marks]) => ({
      subject,
      average: marks.reduce((a, b) => a + b, 0) / marks.length,
    }));

    subjectAverages.sort((a, b) => b.average - a.average);

    res.json({
      totalTests: overviewResults.length,
      averageScore,
      bestSubject: subjectAverages[0]?.subject || '-',
      weakestSubject: subjectAverages[subjectAverages.length - 1]?.subject || '-',
    });

  } catch (error) {
    console.error("❌ Error in getStudentOverview:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
