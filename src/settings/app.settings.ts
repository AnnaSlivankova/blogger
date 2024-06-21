import { config } from 'dotenv';
import * as process from 'process';

config();

export const CONFIG = {
  PORT: process.env.PORT as string,
  DB_LINK: process.env.PG_LINK as string,

  CONFIRM_EMAIL_LINK:
    process.env.CONFIRM_EMAIL_LINK ||
    'http://localhost:3000/auth/registration-confirmation',
  PASS_RECOVERY_LINK:
    process.env.PASS_RECOVERY_LINK || 'http://localhost:3000/auth/new-password',

  CORP_EMAIL: process.env.CORP_EMAIL,
  CORP_PASS: process.env.CORP_PASS,
  JWT_SECRET: process.env.JWT_SECRET,
  REFRESH_TTL: '20d',
  ACCESS_TTL: '10d',
  AUTH_CRED: process.env.AUTH_CRED,
  LOGIN_CRED: process.env.LOGIN_CRED,
  PASS_CRED: process.env.PASS_CRED,
};

export enum PATH {
  BLOGS = 'blogs',
  BLOGS_SA = 'sa/blogs',
  POSTS = 'posts',
  COMMENTS = 'comments',
  USERS_SA = 'sa/users',
  AUTH = 'auth',
  TESTING = 'testing/all-data',
  DEVICES = 'security/devices',
}
