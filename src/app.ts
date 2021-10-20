import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import config from './utils/config';
import usersRouter from './routes/users';

mongoose.connect(config.MONGODB_URI as string)
  .then(() => {
    console.log('connected to mongoose');
  })
  .catch((error) => {
    console.log(error);
  });

const app = express();
app.use(express.static('build'));
app.use(express.json());
app.use(cors());
app.use('/api/users/', usersRouter);

export default app;
