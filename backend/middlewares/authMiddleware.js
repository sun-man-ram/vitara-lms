import jwt from 'jsonwebtoken';

export default function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, userType: decoded.userType, username: decoded.username };
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}
