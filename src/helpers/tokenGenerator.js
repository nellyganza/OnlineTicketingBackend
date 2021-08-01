import jwt from 'jsonwebtoken';

export const newJwtToken = async (data) => await jwt.sign(data, process.env.JWT_SECRET_KEY);
export const getJwtToken = async (data, expiration) => await jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: expiration });
