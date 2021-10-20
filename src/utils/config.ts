require('dotenv').config();
// import dotenv from 'dotenv';

// dotenv.config({ path: '../.env' });

const { PORT } = process.env;

const MONGODB_URI = process.env.NODE_ENV === 'development'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI;

export default { PORT, MONGODB_URI };
