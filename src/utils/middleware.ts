/* eslint-disable consistent-return */
import { Request, Response, NextFunction } from 'express';
import logger from './logger';

const requestLogger = (request: Request, response: Response, next: NextFunction) => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
};

const unknownEndpoint = (request: Request, response: Response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error: Error, request: Request, response: Response, next: NextFunction) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' });
  } if (error.name === 'ParseError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

export default { requestLogger, unknownEndpoint, errorHandler };
