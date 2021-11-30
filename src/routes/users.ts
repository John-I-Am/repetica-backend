import express, { Response, Request } from 'express';
import { getTokenFrom } from '../utils/routeHelpers';
import userService from '../services/users';
import typeguards from '../typeguards';
import { ExistingUser, NewUser } from '../types';

const usersRouter = express.Router();

usersRouter.get('/', async (request: Request, response: Response): Promise<void> => {
  const result: ExistingUser | false | null = await userService.getUser(getTokenFrom(request));
  if (result) {
    response.json(result);
  } else if (result === false) {
    response.status(401).json({ error: 'token missing or invalid' });
  } else if (result === null) {
    response.status(404).json({ error: 'user not found' });
  }
});

usersRouter.post('/', async (request: Request, response: Response): Promise<void> => {
  const newUser: NewUser = typeguards.toNewUser(request.body);
  const result: ExistingUser | false = await userService.addUser(newUser);

  if (result) {
    response.json(result);
  } else {
    response.status(400).json({ error: 'email not unique' });
  }
});

usersRouter.put('/', async (request: Request, response: Response): Promise<void> => {
  const result: ExistingUser | false | undefined | null = await userService.updateUser(
    request.body, getTokenFrom(request),
  );

  if (result) {
    response.json(result);
  } else if (result === false) {
    response.status(401).json({ error: 'token missing or invalid' });
  } else if (result === null) {
    response.status(401).json({ error: 'email not unique' });
  } else if (result === undefined) {
    response.status(404).json({ error: 'user not found' });
  }
});

export default usersRouter;
