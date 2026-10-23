import { ENV } from './env.config.js';

export const JWT_CONFIG = {
  secret: ENV.JWT_SECRET,
  expiresIn: ENV.JWT_EXPIRES_IN,
  refreshSecret: ENV.JWT_REFRESH_SECRET,
  refreshExpiresIn: ENV.JWT_REFRESH_EXPIRES_IN,
};
