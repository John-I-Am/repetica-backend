/* eslint-disable import/first */
require('express-async-errors');

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import config from './utils/config';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import loginRouter from './routes/login';
import testingRouter from './routes/testing';
import logger from './utils/logger';
import middleware from './utils/middleware';

logger.info('connecting to', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI as string)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

const app = express();

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/users/', usersRouter);
app.use('/api/cards/', cardsRouter);
app.use('/api/login/', loginRouter);

if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
