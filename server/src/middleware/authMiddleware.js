import jwt from 'jsonwebtoken';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // Robustly extract token (handle extra spaces or quotes around token)
  const token = authHeader.replace(/^Bearer\s+/, '').trim().replace(/^["']|["']$/g, '');

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET is missing in environment variables!");
      return res.status(500).json({ error: 'Server authentication configuration error' });
    }

    const decoded = jwt.verify(token, secret);
    req.admin = { ...decoded };
    next();
  } catch (err) {
    console.error("Auth Middleware Verification Error:", err.message);
    return res.status(401).json({ error: 'Invalid or expired token', details: err.message });
  }
}

export default authMiddleware;