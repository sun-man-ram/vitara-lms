import xlsx from 'xlsx';
import fs from 'fs';
import { Exam } from '../models/exam.model.js';
import { Student } from '../models/student.model.js';
import { Class } from '../models/class.model.js';
import { ResultMPC } from '../models/resultMPC.model.js';
import { ResultMBiPC } from '../models/resultMBiPC.model.js';
import { ResultMPCAdvanced } from '../models/resultMPCAdvanced.model.js';
import { ResultMBiPCAdvanced } from '../models/resultMBiPCAdvanced.model.js';

export const uploadResults = async (req, res) => {
  try {
    const { examId, schoolId } = req.body;

    if (!req.file || !examId || !schoolId)
      return res.status(400).json({ message: 'File, examId or schoolId missing' });

    const exam = await Exam.findOne({ examId });
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);
    fs.unlinkSync(req.file.path);

    const isMBiPC = exam.course.includes('MBiPC');
    const isAdvanced = exam.type === 'advanced';
    const maxMarks = isAdvanced ? 80 : 100;

    let ResultModel;
    if (isMBiPC && isAdvanced) ResultModel = ResultMBiPCAdvanced;
    else if (isMBiPC) ResultModel = ResultMBiPC;
    else if (isAdvanced) ResultModel = ResultMPCAdvanced;
    else ResultModel = ResultMPC;

    // ✅ Process new rows and update result
    for (const row of rows) {
      const studentId = row['Student ID'] || row.studentId;
      if (!studentId) continue;

      const m = Math.min(Number(row.m || row.maths || 0), maxMarks);
      const p = Math.min(Number(row.p || row.physics || 0), maxMarks);
      const c = Math.min(Number(row.c || row.chemistry || 0), maxMarks);
      const b = isMBiPC ? Math.min(Number(row.b || row.biology || 0), maxMarks) : 0;

      const total = m + p + c + (isMBiPC ? b : 0);

      const update = {
        marks: isMBiPC ? { m, b, p, c } : { m, p, c },
        maxMarks,
        total,
        status: 'result updated',
      };

      await ResultModel.findOneAndUpdate(
        { examId, studentId },
        { $set: update },
        { upsert: true, new: true }
      );
    }

    // ✅ Only rank those who have 'result updated'
    const allResults = await ResultModel.find({ examId, status: 'result updated' }).lean();
    const studentIds = allResults.map(r => r.studentId);
    const students = await Student.find({ studentId: { $in: studentIds } }).lean();

    const classIds = [...new Set(students.map(s => s.classId))];
    const classes = await Class.find({ classId: { $in: classIds } }).lean();

    const studentMap = {};
    const classMap = {};

    students.forEach(s => studentMap[s.studentId] = s);
    classes.forEach(c => classMap[c.classId] = c);

    const groups = {
      section: {},
      class: {},
    };

    const classNameGroups = {};

    for (const result of allResults) {
      const student = studentMap[result.studentId];
      const cls = classMap[student?.classId];

      if (!student || !cls) continue;

      const className = cls.className;
      const sectionKey = `${student.schoolId}_${className}_${cls.section}`;
      const classKey = `${student.schoolId}_${className}`;
      const overallKey = className;

      if (!groups.section[sectionKey]) groups.section[sectionKey] = [];
      groups.section[sectionKey].push(result);

      if (!groups.class[classKey]) groups.class[classKey] = [];
      groups.class[classKey].push(result);

      if (!classNameGroups[overallKey]) classNameGroups[overallKey] = [];
      classNameGroups[overallKey].push(result);
    }

    // ✅ Assign rank
    const assignRank = async (list, field) => {
      list.sort((a, b) => (b.total || 0) - (a.total || 0));
      for (let i = 0; i < list.length; i++) {
        await ResultModel.findOneAndUpdate(
          { examId, studentId: list[i].studentId },
          { $set: { [field]: i + 1 } }
        );
      }
    };

    for (const list of Object.values(groups.section)) await assignRank(list, 'sectionRank');
    for (const list of Object.values(groups.class)) await assignRank(list, 'classRank');
    for (const list of Object.values(classNameGroups)) await assignRank(list, 'overallRank');

    return res.status(200).json({ message: '✅ Results and ranks updated successfully.' });
  } catch (err) {
    console.error('❌ Upload Error:', err);
    return res.status(500).json({ message: 'Server error while uploading results.' });
  }
};

export const getStudentResults = async (req, res) => {
  try {
    const studentId = req.user.username;

    const allResults = [
      await ResultMBiPC.find({ studentId, status: 'result updated' }),
      await ResultMBiPCAdvanced.find({ studentId, status: 'result updated' }),
      await ResultMPC.find({ studentId, status: 'result updated' }),
      await ResultMPCAdvanced.find({ studentId, status: 'result updated' })
    ];

    const filtered = allResults.flat();
    res.status(200).json(filtered);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getPerformanceOverview = async (req, res) => {
  try {
    const studentId = req.user.username;

    const results = [
      ...await ResultMBiPC.find({ studentId, status: 'result updated' }),
      ...await ResultMBiPCAdvanced.find({ studentId, status: 'result updated' }),
      ...await ResultMPC.find({ studentId, status: 'result updated' }),
      ...await ResultMPCAdvanced.find({ studentId, status: 'result updated' })
    ];

    const totalTests = results.length;
    const totalScore = results.reduce((sum, r) => sum + r.total, 0);
    const avgScore = totalTests > 0 ? (totalScore / totalTests) : 0;

    const allSubjects = {};
    results.forEach(result => {
      Object.entries(result.marks).forEach(([subj, mark]) => {
        allSubjects[subj] = (allSubjects[subj] || []);
        allSubjects[subj].push(mark);
      });
    });

    let best = '', worst = '', bestAvg = 0, worstAvg = 100;
    for (const subject in allSubjects) {
      const avg = allSubjects[subject].reduce((a, b) => a + b, 0) / allSubjects[subject].length;
      if (avg > bestAvg) { best = subject; bestAvg = avg; }
      if (avg < worstAvg) { worst = subject; worstAvg = avg; }
    }

    res.status(200).json({
      totalTests,
      averageScore: avgScore.toFixed(2),
      bestSubject: best,
      weakestSubject: worst
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

