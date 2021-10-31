/* eslint-disable consistent-return */
import express, { Request, Response } from 'express';
import loginService from '../services/login';
import { ExistingUser } from '../types';

const loginRouter = express.Router();

loginRouter.post('/', async (request: Request, response: Response): Promise<ExistingUser | any> => {
  const result = await loginService({ email: request.body.email, password: request.body.password });

  if (!result) {
    return response.status(401).json({
      error: 'invalid email or pssword',
    });
  }

  response
    .status(200)
    .send(result);
});

export default loginRouter;
