/* eslint-disable max-len */
import express, { Response, Request } from 'express';
import cardService from '../services/cards';
import { ExistingCard, NewCard } from '../types';
import typeguards from '../typeguards';

const cardsRouter = express.Router();

const getTokenFrom = (request: Request): string | null => {
  const authorization: string | undefined = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

cardsRouter.get('/', async (request: Request, response: Response) => {
  const cards = await cardService.getAllCards(getTokenFrom(request));
  response.json(cards);
});

cardsRouter.get('/:id', async (request: Request, response: Response) => {
  const card = await cardService.getCardById(request.params.id);
  if (card) {
    response.json(card);
  } else {
    response.status(404).end();
  }
});

cardsRouter.post('/', async (request: Request, response: Response) => {
  const newCard: NewCard = typeguards.toNewCard(request.body);
  const result: ExistingCard | false = await cardService.postCard(
    newCard, getTokenFrom(request),
  );

  if (!result) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  return response.json(result);
});

cardsRouter.delete('/:id', async (request: Request, response: Response) => {
  await cardService.deleteCard(request.params.id, getTokenFrom(request));
  response.status(204).end();
});

cardsRouter.put('/:id', async (request: Request, response: Response) => {
  const newCard: NewCard = typeguards.toNewCard(request.body);

  const result = await cardService.updateCard(newCard, request.params.id, getTokenFrom(request));
  response.json(result);
});

export default cardsRouter;
