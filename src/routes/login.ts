import express, { Request, Response } from 'express';
import loginService from '../services/login';
import typeguards from '../typeguards';
import { UserCredential } from '../types';

const loginRouter = express.Router();

loginRouter.post('/', async (request: Request, response: Response): Promise<void> => {
  const userCredential: UserCredential = typeguards.toUserCredential(request.body);
  const result: false | object = await loginService(userCredential);

  if (result) {
    response.status(200).send(result);
  } else {
    response.status(401).json({ error: 'invalid email or password' });
  }
});

export default loginRouter;
