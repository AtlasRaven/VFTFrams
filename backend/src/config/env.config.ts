import dotenv from 'dotenv';
dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';
const JWT_SECRET =
  process.env.JWT_SECRET ||
  (NODE_ENV === 'production'
    ? ''
    : 'vftfarms_secret_jwt_key_2026_super_secure_access');
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET ||
  (NODE_ENV === 'production'
    ? ''
    : 'vftfarms_secret_jwt_refresh_key_2026_super_secure');
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_FULL_NAME = process.env.ADMIN_FULL_NAME;
const ADMIN_PHONE_NUMBER = process.env.ADMIN_PHONE_NUMBER;

if (
  NODE_ENV === 'production' &&
  (!process.env.JWT_SECRET ||
    !process.env.JWT_REFRESH_SECRET ||
    JWT_SECRET.startsWith('replace_with_') ||
    JWT_REFRESH_SECRET.startsWith('replace_with_') ||
    JWT_SECRET.length < 32 ||
    JWT_REFRESH_SECRET.length < 32 ||
    JWT_SECRET === JWT_REFRESH_SECRET)
) {
  throw new Error(
    'Production requires distinct JWT_SECRET and JWT_REFRESH_SECRET values of at least 32 characters.',
  );
}

if (
  NODE_ENV === 'production' &&
  (!ADMIN_EMAIL ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ADMIN_EMAIL) ||
    !ADMIN_PASSWORD ||
    ADMIN_PASSWORD.length < 16 ||
    ADMIN_PASSWORD.startsWith('replace_with_') ||
    ADMIN_PASSWORD === 'Admin@123456' ||
    !ADMIN_FULL_NAME ||
    !ADMIN_PHONE_NUMBER)
) {
  throw new Error(
    'Production requires ADMIN_EMAIL, ADMIN_FULL_NAME, ADMIN_PHONE_NUMBER, and an ADMIN_PASSWORD of at least 16 characters.',
  );
}

export const ENV = {
  PORT: parseInt(process.env.PORT || '4000', 10),
  NODE_ENV,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  ADMIN_FULL_NAME,
  ADMIN_PHONE_NUMBER,
  FREE_SHIPPING_THRESHOLD: parseInt(
    process.env.FREE_SHIPPING_THRESHOLD || '150000',
    10,
  ),
  DEFAULT_SHIPPING_FEE: parseInt(
    process.env.DEFAULT_SHIPPING_FEE || '25000',
    10,
  ),
};
