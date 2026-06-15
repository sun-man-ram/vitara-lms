import User from '../models/users.model.js';
import jwt from 'jsonwebtoken';
import { decryptPassword } from '../utils/encryption.js'; // AES decrypt

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Please provide all the fields" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const decryptedPassword = decryptPassword(user.password);
    if (password !== decryptedPassword) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, userType: user.userType, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      token,
      userType: user.userType
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};
