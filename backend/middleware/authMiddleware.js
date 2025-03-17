import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ error: 'No token provided or invalid format' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized access' });
    }
    req.user = { _id: decoded.userId, role: decoded.role }; // Ensure correct structure
    next();
  });
};

export const authorizeRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
  }
  next();
};

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).send({ error: 'Please authenticate.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: decoded.userId }; // Match the property name used in the route handler
    next();
  } catch (e) {
    res.status(401).send({ error: 'Invalid token.' });
  }
};

export const isAdminMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Get token from Authorization header

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized. Token not provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.user = decoded; // Attach decoded payload to the request

    if (req.user.role === 'admin') {
      next(); // Allow access
    } else {
      res.status(403).json({ error: 'Access denied. Admins only.' });
    }
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }
};


export default authMiddleware;
