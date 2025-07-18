import { v5 as uuidv5 } from 'uuid';
import { v4 as uuidv4 } from 'uuid';

const NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

export const generateClassId = (schoolId, className, section) => {
  const baseInput = `${schoolId}-${className}-${section}`.toLowerCase();
  const deterministicPart = uuidv5(baseInput, NAMESPACE).split('-')[0]; // Short deterministic part
  const randomPart = uuidv4().split('-')[0]; // Short random suffix
  return `CLS-${deterministicPart}-${randomPart}`; // e.g., CLS-4A1B2C3D-E7F8G9
};
