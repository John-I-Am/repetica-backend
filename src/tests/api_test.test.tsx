/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/order */
import supertest from 'supertest';
import mongoose from 'mongoose';
import Card from '../models/card';
import User from '../models/user';
import bcrypt from 'bcrypt';
import helper from './helper';
import app from '../app';

const api = supertest(app);

describe('where there is initially one user', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('root', 10);
    const user = new User({
      name: 'rootname', surname: 'rootsurname', passwordHash, email: 'root@root.com',
    });

    await user.save();
  });

  test('creation succeeds with a new email', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: 'rootname2',
      surname: 'rootsurname2',
      password: 'root',
      email: 'root2@root.com',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const emails = usersAtEnd.map((u: any) => u.email);
    expect(emails).toContain(newUser.email);
  });

  test('creation fails with message if email taken', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: 'root2',
      surname: 'root2',
      email: 'root@root.com',
      password: 'root',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('`email` to be unique');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('login succeeds and returns status', async () => {
    const userCredentials = {
      email: 'root@root.com',
      password: 'root',
    };

    const result = await api
      .post('/api/login')
      .send(userCredentials)
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
});

let token: any;

describe('when there is initially one card saved', () => {
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
      front: 'second',
      back: 'card',
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
      .send({ front: 'test', back: 'tsting', level: 4 })
      .expect(200);

    const cardsAtEnd = await helper.cardsInDb();
    expect(cardsAtEnd).toHaveLength(cardsAtStart.length + 1);

    const contents = cardsAtEnd.map((c: any) => c.front);
    expect(contents).toContain(
      'test',
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
      .expect(204);

    const cardsAtEnd = await helper.cardsInDb();
    expect(cardsAtEnd).toHaveLength(
      cardsAtStart.length - 1,
    );

    const contents = cardsAtEnd.map((r: any) => r.content);

    expect(contents).not.toContain(cardToDelete.front);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
