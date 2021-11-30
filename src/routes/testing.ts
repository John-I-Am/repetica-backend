import express, { Response, Request } from 'express';
import Card from '../models/card';
import User from '../models/user';

const testingRouter = express.Router();

testingRouter.post('/reset', async (request: Request, response: Response): Promise<void> => {
  await Card.deleteMany({});
  await User.deleteMany({});

  response.status(204).end();
});

export default testingRouter;
