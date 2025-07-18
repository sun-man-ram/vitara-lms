import { School } from '../models/schoolregistration.model.js';
import User from '../models/users.model.js';
import { generateSchoolId } from '../utils/schoolIdgenerator.js';
import { generatePassword } from '../utils/passwordGenerator.js';
import { encryptPassword, decryptPassword } from '../utils/encryption.js';
import { generateUniqueSchoolCode } from '../utils/SchoolCodeGenerator.js';

export const schoolregistration = async (req, res) => {
  try {
    const {
      schoolName,
      boardOfAffiliation,
      address,
      officialEmail,
      contactNumber,
      iitFoundationInchargeName,
      inchargeContactNumber,
      inchargeEmail,
    } = req.body;

    const schoolId = generateSchoolId(schoolName, address, officialEmail);
    const existingSchool = await School.findOne({ officialEmail });

    if (existingSchool) {
      return res.status(400).json({ message: "School already registered." });
    }

    const schoolCode = await generateUniqueSchoolCode();
    const newSchool = new School({
      schoolId,
      schoolCode,
      schoolName,
      boardOfAffiliation,
      address,
      officialEmail,
      contactNumber,
      iitFoundationInchargeName,
      inchargeContactNumber,
      inchargeEmail,
      active: true,
    });

    await newSchool.save();

    const rawPassword = generatePassword();
    const encryptedPassword = encryptPassword(rawPassword);

    const newUser = new User({
      username: schoolId,
      password: encryptedPassword,
      userType: "schoolAdmin"
    });

    await newUser.save();

    res.status(201).json({
      message: "School and user registered successfully",
      school: newSchool,
      credentials: {
        username: schoolId,
        password: rawPassword
      }
    });
  } catch (error) {
    console.error("School registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const bulkSchoolRegistration = async (req, res) => {
  try {
    const schools = req.body.schools;

    if (!Array.isArray(schools) || schools.length === 0) {
      return res.status(400).json({ message: 'Invalid or empty data' });
    }

    const existingEmails = await School.find({ officialEmail: { $in: schools.map(s => s.officialEmail) } }, 'officialEmail');
    const duplicates = existingEmails.map(s => s.officialEmail);

    if (duplicates.length > 0) {
      return res.status(400).json({ message: `Duplicate emails found: ${duplicates.join(', ')}` });
    }

    const createdSchools = [];
    const createdUsers = [];

    for (const data of schools) {
      const schoolId = generateSchoolId(data.schoolName, data.address, data.officialEmail);
      const schoolCode = await generateUniqueSchoolCode();

      const newSchool = new School({
        ...data,
        schoolId,
        schoolCode,
        active: true
      });

      await newSchool.save();
      createdSchools.push(newSchool);

      const rawPassword = generatePassword();
      const encryptedPassword = encryptPassword(rawPassword);

      const newUser = new User({
        username: schoolId,
        password: encryptedPassword,
        userType: "schoolAdmin"
      });

      await newUser.save();
      createdUsers.push({ username: schoolId, password: rawPassword });
    }

    res.status(201).json({
      message: 'Schools and users registered successfully',
      count: createdSchools.length,
      credentials: createdUsers
    });

  } catch (err) {
    console.error('Bulk registration error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
export const getAllSchools = async (req, res) => {
  try {
    const schoolsRaw = await School.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'schoolId',
          foreignField: 'username',
          as: 'userInfo'
        }
      },
      {
        $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true }
      },
      {
        $project: {
          schoolId: 1,
          schoolCode: 1, // ✅ Include schoolCode here
          schoolName: 1,
          boardOfAffiliation: 1,
          address: 1,
          officialEmail: 1,
          contactNumber: 1,
          iitFoundationInchargeName: 1,
          inchargeContactNumber: 1,
          inchargeEmail: 1,
          active: 1,
          encryptedPassword: "$userInfo.password"
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    const schools = schoolsRaw.map((school) => {
      let password = '';
      try {
        if (school.encryptedPassword) {
          password = decryptPassword(school.encryptedPassword);
        }
      } catch (err) {
        console.error(`Failed to decrypt password for schoolId ${school.schoolId}:`, err);
      }

      return {
        ...school,
        password
      };
    });

    res.status(200).json(schools);
  } catch (err) {
    console.error('Failed to fetch schools:', err);
    res.status(500).json({ message: 'Failed to fetch schools' });
  }
};


export const toggleSchoolStatus = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const school = await School.findOne({ schoolId });

    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    school.active = !school.active;
    await school.save();

    res.status(200).json({
      message: `School ${school.active ? 'activated' : 'deactivated'} successfully`,
      active: school.active
    });
  } catch (error) {
    console.error('Toggle error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateSchool = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const updateData = { ...req.body };
    delete updateData.schoolId;

    const updatedSchool = await School.findOneAndUpdate(
      { schoolId },
      updateData,
      { new: true }
    );

    if (!updatedSchool) {
      return res.status(404).json({ message: 'School not found' });
    }

    res.status(200).json({
      message: 'School updated successfully',
      school: updatedSchool
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
