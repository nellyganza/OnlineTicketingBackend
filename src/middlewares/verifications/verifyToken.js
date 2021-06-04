import jwt from 'jsonwebtoken';

export const decodeToken = async (token) => await jwt.verify(token, process.env.JWT_SECRET_KEY);
