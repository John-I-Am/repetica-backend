/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Response, Request } from 'express';
import userService from '../services/users';
import typeguards from '../typeguards';
import { NewUser } from '../types';

const usersRouter = express.Router();

const getTokenFrom = (request: Request): any => {
  const authorization: string | undefined = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

usersRouter.get('/', async (request: Request, response: Response) => {
  const result = await userService.fetchInfo(getTokenFrom(request));
  if (result) {
    response.json(result);
  } else {
    response.status(404).end();
  }
});

usersRouter.post('/', async (request: Request, response: Response) => {
  const newUser: NewUser = typeguards.toNewUser(request.body);

  const result = await userService.addUser(newUser);
  if ('error' in result) {
    response.status(400).json(result);
  } else {
    response.json(result);
  }
});

usersRouter.put('/', async (request: Request, response: Response) => {
  const result: any = await userService.updateUser(request.body, getTokenFrom(request));
  if ('error' in result) {
    response.status(400).json(result);
  } else {
    response.json(result);
  }
});

export default usersRouter;
