/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
import supertest from 'supertest';
import mongoose from 'mongoose';
import helper from './helper';
import app from '../app';
import Card from '../models/card';
import Deck from '../models/deck';

const api = supertest(app);

describe('when there is initally one deck with one card', () => {
  let token: string;
  beforeEach(async () => {
    await Card.deleteMany({});
    await Deck.deleteMany({});

    const userCredentials = {
      email: 'updatedroot@root.com',
      password: 'rootpass',
    };

    const result = await api
      .post('/api/login')
      .send(userCredentials);

    token = result.body.token;

    const newDeck = {
      title: 'new deck',
    };

    const response = await api
      .post('/api/decks')
      .set('Authorization', `bearer ${token}`)
      .send(newDeck);

    const newCard = {
      deckId: response.body.id,
      front: 'front',
      back: '[]',
      level: 1,
    };

    await api
      .post('/api/cards')
      .set('Authorization', `bearer ${token}`)
      .send(newCard);
  });

  test('creation of deck succeeds', async () => {
    const decksAtStart = await helper.decksInDb();

    const response = await api
      .post('/api/decks')
      .set('Authorization', `bearer ${token}`)
      .send({ title: 'deck title' })
      .expect(200);

    const decksAtEnd = await helper.decksInDb();
    expect(decksAtEnd).toHaveLength(decksAtStart.length + 1);

    const ids = decksAtEnd.map((deck: any) => deck.id);
    expect(ids).toContain(response.body.id);
  });

  test('creation of card succeeds', async () => {
    const decksAtStart = await helper.decksInDb();
    const cardsAtStart = await helper.cardsInDb();

    await api
      .post('/api/cards')
      .set('Authorization', `bearer ${token}`)
      .send({
        deckId: decksAtStart[0].id, front: 'honey', back: 'test', level: 4,
      })
      .expect(200);

    const cardsAtEnd = await helper.cardsInDb();
    expect(cardsAtEnd).toHaveLength(cardsAtStart.length + 1);

    const contents = cardsAtEnd.map((card: any) => card.front);
    expect(contents).toContain(
      'honey',
    );
  });

  test('All cards are returned', async () => {
    const cardsAtStart = await helper.cardsInDb();

    const response = await api
      .get('/api/cards')
      .set('Authorization', `bearer ${token}`);

    expect(response.body).toHaveLength(cardsAtStart.length);
  });

  test('All decks are returned', async () => {
    const decksAtStart = await helper.decksInDb();

    const response = await api
      .get('/api/cards')
      .set('Authorization', `bearer ${token}`);

    expect(response.body).toHaveLength(decksAtStart.length);
  });

  test('Deletion of card Succeeds with status code', async () => {
    const cardsAtStart = await helper.cardsInDb();
    const cardToDelete = cardsAtStart[0];

    await api
      .delete(`/api/cards/${cardToDelete.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204);

    const cardsAtEnd = await helper.cardsInDb();
    expect(cardsAtEnd).toHaveLength(
      cardsAtStart.length - 1,
    );

    const contents = cardsAtEnd.map((r: any) => r.content);
    expect(contents).not.toContain(cardToDelete);
  });

  test('Deletion of deck Succeeds with status code', async () => {
    const decksAtStart = await helper.decksInDb();
    const deckToDelete = decksAtStart[0];

    await api
      .delete(`/api/decks/${deckToDelete.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204);

    const decksAtEnd = await helper.decksInDb();
    expect(decksAtEnd).toHaveLength(
      decksAtStart.length - 1,
    );

    const ids = decksAtEnd.map((deck: any) => deck.id);
    expect(ids).not.toContain(deckToDelete.id);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
