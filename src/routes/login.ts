/* eslint-disable consistent-return */
import express, { Request, Response } from 'express';
import loginService from '../services/login';
import typeguards from '../typeguards';
import { ExistingUser, UserCredential } from '../types';

const loginRouter = express.Router();

loginRouter.post('/', async (request: Request, response: Response): Promise<ExistingUser | any> => {
  const userCredential: UserCredential = typeguards.toUserCredential(request.body);
  const result = await loginService(userCredential);

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
