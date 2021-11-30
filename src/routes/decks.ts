import express, { Response, Request } from 'express';
import { getTokenFrom } from '../utils/routeHelpers';
import deckService from '../services/decks';
import { ExistingDeck } from '../types';

const deckRouter = express.Router();

deckRouter.get('/', async (request: Request, response: Response): Promise<void> => {
  const result: ExistingDeck[] | false = await deckService.getAllDecks(getTokenFrom(request));

  if (result) {
    response.json(result);
  } else if (result === false) {
    response.status(401).json({ error: 'token missing or invalid' });
  }
});

deckRouter.post('/', async (request: Request, response: Response): Promise<void> => {
  const result: ExistingDeck | false | null = await deckService.createDeck(getTokenFrom(request));

  if (result) {
    response.json(result);
  } else if (result === false) {
    response.status(401).json({ error: 'token missing or invalid' });
  } else if (result === null) {
    response.status(404).json({ error: 'user not found' });
  }
});

deckRouter.put('/:id', async (request: Request, response: Response): Promise<void> => {
  const result: ExistingDeck | false | null = await deckService.updateDeck(
    request.body, request.params.id, getTokenFrom(request),
  );

  if (result) {
    response.json(result);
  } else if (result === false) {
    response.status(401).json({ error: 'token missing or invalid' });
  } else if (result === null) {
    response.status(404).json({ error: 'deck not found' });
  }
});

deckRouter.delete('/:id', async (request: Request, response: Response): Promise<void> => {
  const result: ExistingDeck | false | null = await deckService.deleteDeck(
    request.params.id, getTokenFrom(request),
  );

  if (result) {
    response.status(204).end();
  } else if (result === false) {
    response.status(401).json({ error: 'token missing or invalid' });
  } else if (result === null) {
    response.status(404).json({ error: 'deck not found' });
  }
});

export default deckRouter;
