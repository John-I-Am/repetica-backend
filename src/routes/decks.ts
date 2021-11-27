import express, { Response, Request } from 'express';
import deckService from '../services/decks';

const deckRouter = express.Router();

const getTokenFrom = (request: Request): string | null => {
  const authorization: string | undefined = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

deckRouter.get('/', async (request: Request, response: Response) => {
  const cards = await deckService.getAllDecks(getTokenFrom(request));
  response.json(cards);
});

deckRouter.post('/', async (request: Request, response: Response) => {
  const result: any = await deckService.createDeck(getTokenFrom(request));

  if (!result) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  return response.json(result);
});

deckRouter.put('/:id', async (request: Request, response: Response) => {
  const result = await deckService.updateDeck(
    request.body, request.params.id, getTokenFrom(request),
  );
  response.json(result);
});

deckRouter.delete('/:id', async (request: Request, response: Response) => {
  await deckService.deleteDeck(request.params.id, getTokenFrom(request));
  response.status(204).end();
});

export default deckRouter;
