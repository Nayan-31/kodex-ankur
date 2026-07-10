import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';

export const requireAuth = (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(Object.assign(new Error('Authorization token is required'), { statusCode: 401 }));
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.userId = payload.userId;
    return next();
  } catch (_error) {
    return next(Object.assign(new Error('Invalid or expired token'), { statusCode: 401 }));
  }
};