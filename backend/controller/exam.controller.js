import { Exam } from '../models/exam.model.js';
import { ResultMPC } from '../models/resultMPC.model.js';
import { ResultMBiPC } from '../models/resultMBiPC.model.js';
import { ResultMPCAdvanced } from '../models/resultMPCAdvanced.model.js';
import { ResultMBiPCAdvanced } from '../models/resultMBiPCAdvanced.model.js';
import { Student } from '../models/student.model.js';
import { Class } from '../models/class.model.js';

// 🔄 Generate next 5-digit exam ID based on latest in DB
const generateExamId = async () => {
  const lastExam = await Exam.findOne().sort({ createdAt: -1 }).lean();
  if (!lastExam || !lastExam.examId) return "00001";

  const lastId = parseInt(lastExam.examId);
  const newId = (lastId + 1).toString().padStart(5, '0');
  return newId;
};

export const createExam = async (req, res) => {
  try {
    const { date, course, type } = req.body;

    if (!date || !course || !type) {
      return res.status(400).json({ message: "Please provide all exam details." });
    }

    const examId = await generateExamId();

    const newExam = new Exam({ examId, date, course, type });
    await newExam.save();

    const matchingClasses = await Class.find({ course });
    const classIds = matchingClasses.map(c => c.classId);

    const students = await Student.find({ classId: { $in: classIds } });

    const tasks = [];

    for (const student of students) {
      const resultData = {
        examId,
        studentId: student.studentId
      };

      if (type === 'mains' && course.includes('MPC')) {
        tasks.push(new ResultMPC({ ...resultData}).save());
      } else if (type === 'mains' && course.includes('MBiPC')) {
        tasks.push(new ResultMBiPC({ ...resultData}).save());
      } else if (type === 'advanced' && course.includes('MPC')) {
        tasks.push(new ResultMPCAdvanced({ ...resultData}).save());
      } else if (type === 'advanced' && course.includes('MBiPC')) {
        tasks.push(new ResultMBiPCAdvanced({ ...resultData}).save());
      }
    }

    await Promise.all(tasks);

    res.status(201).json({
      message: '✅ Exam created and results initialized.',
      totalStudents: students.length,
      examId
    });

  } catch (err) {
    console.error('❌ Exam creation error:', err);
    res.status(500).json({ message: 'Server error during exam creation.' });
  }
};


export const getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find().sort({ createdAt: -1 });
    res.status(200).json(exams);
  } catch (err) {
    console.error('Error fetching exams:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteExam = async (req, res) => {
  try {
    const { examId } = req.params;

    const deletedExam = await Exam.findOneAndDelete({ examId });

    if (!deletedExam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Delete all associated results
    const [mpc, mbipc, mpcAdv, mbipcAdv] = await Promise.all([
      ResultMPC.deleteMany({ examId }),
      ResultMBiPC.deleteMany({ examId }),
      ResultMPCAdvanced.deleteMany({ examId }),
      ResultMBiPCAdvanced.deleteMany({ examId })
    ]);

    res.status(200).json({
      message: '✅ Exam and related results deleted successfully',
      deletedExam,
      deletedResults: {
        ResultMPC: mpc.deletedCount,
        ResultMBiPC: mbipc.deletedCount,
        ResultMPCAdvanced: mpcAdv.deletedCount,
        ResultMBiPCAdvanced: mbipcAdv.deletedCount
      }
    });
  } catch (err) {
    console.error('❌ Delete exam error:', err);
    res.status(500).json({ message: 'Server error while deleting exam' });
  }
};

export const getUpcomingExams = async (req, res) => {
  try {
    const studentId = req.user.username;

    const student = await Student.findOne({ studentId });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const classObj = await Class.findOne({ classId: student.classId });
    if (!classObj) return res.status(404).json({ message: "Class not found" });

    const today = new Date();
    const exams = await Exam.find({
      date: { $gte: today },
      course: classObj.course
    });

    res.status(200).json(exams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
