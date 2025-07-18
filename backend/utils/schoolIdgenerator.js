import { v5 as uuidv5 } from 'uuid';

const NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'; // static namespace

export const generateSchoolId = (schoolName, address, email) => {
  const input = `${schoolName}-${address}-${email}`.toLowerCase();
  const uuid = uuidv5(input, NAMESPACE);
  return `SCH-${uuid.split('-')[0].toUpperCase()}`; // e.g., SCH-5A12F3A4
};
