import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/roktobondhu',
  REDIS_URL: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  JWT_SECRET: process.env.JWT_SECRET || 'roktobondhu_secure_jwt_secret_token_2026_bd',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  COOKIE_NAME: 'roktobondhu_token',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  DEFAULT_ELIGIBILITY_DAYS: parseInt(process.env.ELIGIBILITY_DAYS || '90', 10),
};
