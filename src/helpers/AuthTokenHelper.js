/* eslint-disable class-methods-use-this */
import jwt from 'jsonwebtoken';

import 'dotenv/config';

export default new class AuthTokenHelper {
  generateToken(payload) {
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
    return token;
  }
}();
