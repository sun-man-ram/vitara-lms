import { School } from '../models/schoolregistration.model.js';

export const generateUniqueSchoolCode = async () => {
  let code;
  let exists = true;

  while (exists) {
    code = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit number
    const existing = await School.findOne({ schoolCode: code });
    if (!existing) exists = false;
  }

  return code;
};
