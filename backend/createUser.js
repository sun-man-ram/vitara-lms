// createUser.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/users.model.js';
import { encryptPassword } from './utils/encryption.js'; // ✅ AES encryption function

dotenv.config(); // Load .env before using MONGO_URI

(async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    const rawPassword = 'admin';
    const encryptedPassword = encryptPassword(rawPassword); // ✅ AES encryption

    await User.create({
      username: 'admin',
      password: encryptedPassword,
      userType: 'superAdmin' // Use your enum if defined
    });

    console.log('✅ User created successfully with AES-encrypted password');
    process.exit();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
