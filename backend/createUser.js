// createUser.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/users.model.js'; // Make sure filename matches exactly

dotenv.config(); // must be called before accessing env vars

try {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  const hashedPassword = await bcrypt.hash('21mcme16', 10);
  await User.create({
    username: '21mcme16',
    password: hashedPassword,
    userType: 'student' // use lowercase to match enum
  });
  console.log('✅ User created successfully');
  process.exit();
} catch (err) {
  console.error('❌ Error:', err.message);
  process.exit(1);
}
