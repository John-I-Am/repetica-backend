/* eslint-disable consistent-return */
import express, { Request, Response } from 'express';
import loginService from '../services/login';

const loginRouter = express.Router();

loginRouter.post('/', async (request: Request, response: Response) => {
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
