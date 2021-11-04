/* eslint-disable import/no-extraneous-dependencies */
import supertest from 'supertest';
import mongoose from 'mongoose';
import helper from './helper';
import app from '../app';
import Card from '../models/card';

const api = supertest(app);
let token: string;

describe('when there is initally one card saved', () => {
  beforeEach(async () => {
    await Card.deleteMany({});

    const userCredentials = {
      email: 'root@root.com',
      password: 'root',
    };

    const result = await api
      .post('/api/login')
      .send(userCredentials);

    token = result.body.token;

    const newCard = {
      front: 'front',
      back: '[]',
      level: 1,
    };

    await api
      .post('/api/cards')
      .set('Authorization', `bearer ${token}`)
      .send(newCard);
  });

  test('creation of card succeeds', async () => {
    const cardsAtStart = await helper.cardsInDb();

    await api
      .post('/api/cards')
      .set('Authorization', `bearer ${token}`)
      .send({
        front: 'honey', back: 'test', level: 4,
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
    const response = await api
      .get('/api/cards')
      .set('Authorization', `bearer ${token}`);

    expect(response.body).toHaveLength(1);
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
});

afterAll(() => {
  mongoose.connection.close();
});
