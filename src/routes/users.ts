import express, { Response, Request } from 'express';
import userService from '../services/users';
import typeguards from '../typeguards';
import { NewUser } from '../types';

const usersRouter = express.Router();

usersRouter.post('/', async (request: Request, response: Response) => {
  const newUser: NewUser = typeguards.toNewUser(request.body);

  const result = await userService.addUser(newUser);
  response.json(result);
});

export default usersRouter;
