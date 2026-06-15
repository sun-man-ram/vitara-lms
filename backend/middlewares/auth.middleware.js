import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      userType: decoded.userType,
      username: decoded.username || decoded.id // assume studentId is passed
    };
    next();
  } catch (err) {
    return res.status(403).json({ msg: "Invalid token" });
  }
};
