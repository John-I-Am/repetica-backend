import express, { Response, Request } from 'express';
import { getTokenFrom } from '../utils/routeHelpers';
import cardService from '../services/cards';
import { ExistingCard, NewCard } from '../types';
import typeguards from '../typeguards';

const cardsRouter = express.Router();

cardsRouter.get('/', async (request: Request, response: Response): Promise<void> => {
  const result: ExistingCard[] | false = await cardService.getAllCards(getTokenFrom(request));
  if (result) {
    response.json(result);
  } else {
    response.status(401).json({ error: 'token missing or invalid' });
  }
});

cardsRouter.get('/:id', async (request: Request, response: Response): Promise<void> => {
  const result: ExistingCard | false | null = await cardService.getCardById(
    request.params.id,
    getTokenFrom(request),
  );

  if (result) {
    response.json(result);
  } else if (result === null) {
    response.status(404).json({ error: 'card not found' });
  } else {
    response.status(401).json({ error: 'token missing or invalid' });
  }
});

cardsRouter.post('/', async (request: Request, response: Response): Promise<void> => {
  const newCard: NewCard = typeguards.toNewCard(request.body);
  const result: ExistingCard | false | null = await cardService.postCard(
    request.body.deckId, newCard, getTokenFrom(request),
  );

  if (result) {
    response.json(result);
  } else if (result === false) {
    response.status(401).json({ error: 'token missing or invalid' });
  } else if (result === null) {
    response.status(404).json({ error: 'user not found' });
  }
});

cardsRouter.delete('/:id', async (request: Request, response: Response): Promise<void> => {
  const result: ExistingCard | false | null = await cardService.deleteCard(
    request.params.id, getTokenFrom(request),
  );
  if (result) {
    response.status(204).end();
  } else if (result === false) {
    response.status(401).json({ error: 'token missing or invalid' });
  } else if (result === null) {
    response.status(404).json({ error: 'card not found' });
  }
});

cardsRouter.put('/:id', async (request: Request, response: Response): Promise<void> => {
  const newCard: NewCard = typeguards.toNewCard(request.body);

  const result: ExistingCard | false | null = await cardService.updateCard(
    newCard, request.params.id, getTokenFrom(request),
  );

  if (result) {
    response.json(result);
  } else if (result === false) {
    response.status(401).json({ error: 'token missing or invalid' });
  } else if (result === null) {
    response.status(404).json({ error: 'card not found' });
  }
});

export default cardsRouter;
