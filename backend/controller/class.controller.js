import { Class } from "../models/class.model.js";
import { School } from "../models/schoolregistration.model.js";

import { generateClassId } from '../utils/classIdGenerator.js';

export const createClass = async (req, res) => {
  try {
    const {
      schoolId,
      className,
      section,
      course
    } = req.body;

    const school = await School.findOne({ schoolId });
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    const classId = generateClassId(schoolId, className, section);

    const exists = await Class.findOne({ classId });
    if (exists) {
      return res.status(409).json({ message: 'Class already exists' });
    }

    const newClass = new Class({
      classId,
      schoolId,
      className,
      section,
      course,
    });

    await newClass.save();
    res.status(201).json({ message: 'Class created successfully', class: newClass });
  } catch (err) {
    console.error('Create Class Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const bulkCreateClasses = async (req, res) => {
  try {
    const classArray = req.body;
    if (!Array.isArray(classArray) || classArray.length === 0) {
      return res.status(400).json({ message: 'No data provided' });
    }

    let inserted = 0;
    let skipped = 0;

    for (const item of classArray) {
      const { schoolId, className, section, course } = item;

      if (!schoolId || !className || !section || !course) {
        console.warn("Skipping invalid item:", item);
        skipped++;
        continue;
      }

      // Check if school exists
      const school = await School.findOne({ schoolId });
      if (!school) {
        console.warn("Skipping - school not found:", schoolId);
        skipped++;
        continue;
      }

      // Generate and check classId
      const classId = generateClassId(schoolId, className, section);
      const existing = await Class.findOne({ classId });
      if (existing) {
        console.warn("Skipping duplicate classId:", classId);
        skipped++;
        continue;
      }

      const newClass = new Class({
        classId,
        schoolId,
        className,
        section,
        course,
      });

      await newClass.save();
      inserted++;
    }

    res.status(201).json({
      message: 'Bulk upload completed',
      inserted,
      skipped,
    });
  } catch (error) {
    console.error('Bulk upload error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const getClassesBySchoolId = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const classes = await Class.find({ schoolId });
    res.status(200).json(classes);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch classes' });
  }
};

export const getClassByClassId = async (req, res) => {
  try {
    const classItem = await Class.findOne({ classId: req.params.id }); // ✅ query by classId

    if (!classItem) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.status(200).json(classItem);
  } catch (error) {
    console.error("❌ Error in getClassByClassId:", error);
    res.status(500).json({ message: "Server error" });
  }
};
