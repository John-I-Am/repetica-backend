/* eslint-disable max-len */
import { Response, Request } from 'express';
import cardService from '../services/cards';

const getTokenFrom = (request: Request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

const cardsRouter = require('express').Router();

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
  const result = await cardService.postCard({
    front: request.body.front,
    back: request.body.back,
    level: request.body.level,
  }, getTokenFrom(request));

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
  const updatedCard = {
    front: request.body.front,
    back: request.body.back,
    level: request.body.level,
  };

  const result = await cardService.updateCard(updatedCard, request.params.id, getTokenFrom(request));
  response.json(result);
});

export default cardsRouter;
