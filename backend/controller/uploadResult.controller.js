import xlsx from 'xlsx';
import { Exam } from '../models/exam.model.js';
import { Student } from '../models/student.model.js';
import { Class } from '../models/class.model.js';
import { ResultMPC } from '../models/resultMPC.model.js';
import { ResultMBiPC } from '../models/resultMBiPC.model.js';
import { ResultMPCAdvanced } from '../models/resultMPCAdvanced.model.js';
import { ResultMBiPCAdvanced } from '../models/resultMBiPCAdvanced.model.js';
import fs from 'fs';

export const uploadResults = async (req, res) => {
  try {
    const { examId, schoolId } = req.body;
    if (!req.file || !examId || !schoolId)
      return res.status(400).json({ message: 'File, examId or schoolId missing' });

    const exam = await Exam.findOne({ examId });
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);
    fs.unlinkSync(req.file.path); // delete file after parsing

    const model = (exam.type === 'mains' && exam.course.includes('MPC')) ? ResultMPC
               : (exam.type === 'mains' && exam.course.includes('MBiPC')) ? ResultMBiPC
               : (exam.type === 'advanced' && exam.course.includes('MPC')) ? ResultMPCAdvanced
               : ResultMBiPCAdvanced;

    const max = exam.type === 'mains' ? 100 : 80;

    // Update marks
    for (const row of data) {
      const studentId = row['Student ID'] || row.studentId;
      const m = Math.min(row.m || 0, max);
      const p = Math.min(row.p || 0, max);
      const c = Math.min(row.c || 0, max);
      const b = row.b !== undefined ? Math.min(row.b, max) : undefined;

      const updateFields = {
        maths: m, physics: p, chemistry: c,
        examStatus: 'result updated'
      };

      if (b !== undefined) updateFields.biology = b;

      await model.findOneAndUpdate(
        { examId, studentId },
        { $set: updateFields },
        { new: true }
      );
    }

    // Rank Calculation Logic
    const results = await model.find({ examId }).lean();

    // Get Student Info to group by section/class/school
    const studentMap = {};
    const students = await Student.find({ studentId: { $in: results.map(r => r.studentId) } }).lean();
    students.forEach(s => studentMap[s.studentId] = s);

    const grouped = {
      section: {},
      class: {},
      overall: []
    };

    for (const r of results) {
      const s = studentMap[r.studentId];
      const total = (r.maths || 0) + (r.physics || 0) + (r.chemistry || 0) + (r.biology || 0);

      r.total = total;
      grouped.overall.push(r);

      const secKey = `${s.classId}_${s.schoolId}_${s.section}`;
      const clsKey = `${s.classId}_${s.schoolId}`;

      if (!grouped.section[secKey]) grouped.section[secKey] = [];
      if (!grouped.class[clsKey]) grouped.class[clsKey] = [];

      grouped.section[secKey].push(r);
      grouped.class[clsKey].push(r);
    }

    // Rank and Update
    const rankAndUpdate = async (list, key) => {
      list.sort((a, b) => b.total - a.total);
      for (let i = 0; i < list.length; i++) {
        const rankField = key + 'Rank';
        await model.findOneAndUpdate(
          { examId, studentId: list[i].studentId },
          { $set: { [rankField]: i + 1 } }
        );
      }
    };

    for (const secList of Object.values(grouped.section)) await rankAndUpdate(secList, 'section');
    for (const clsList of Object.values(grouped.class)) await rankAndUpdate(clsList, 'class');
    await rankAndUpdate(grouped.overall, 'overall');

    // Finally update exam status
    exam.status = 'result updated';
    await exam.save();

    res.status(200).json({ message: '✅ Results uploaded and ranks updated.' });

  } catch (err) {
    console.error('❌ Upload error:', err);
    res.status(500).json({ message: 'Error processing file' });
  }
};
