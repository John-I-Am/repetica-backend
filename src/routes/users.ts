import { Response, Request } from 'express';
import userService from '../services/users';

const usersRouter = require('express').Router();

usersRouter.post('/', async (request: Request, response: Response) => {
  const user = {
    email: request.body.email,
    name: request.body.name,
    surname: request.body.surname,
    password: request.body.password,
  };

  const newUser = await userService.addUser(user);
  response.json(newUser);
});

export default usersRouter;
