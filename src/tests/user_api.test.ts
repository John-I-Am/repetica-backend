/* eslint-disable import/no-extraneous-dependencies */
import supertest from 'supertest';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import helper from './helper';
import User from '../models/user';
import app from '../app';
import { ExistingUser } from '../types';

const api = supertest(app);

describe('where there is intially one user', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash: string = await bcrypt.hash('root', 10);
    const user: ExistingUser = new User({
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
      email: 'root2@root',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const emails = usersAtEnd.map((user: any) => user.email);
    expect(emails).toContain(newUser.email);
  });

  test('creation fails with message if email taken', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: 'rootname3',
      surname: 'rootsurname3',
      password: 'root',
      email: 'root@root.com',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('email not unique');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('login succeeds and returns token', async () => {
    const userCredentials = {
      email: 'root@root.com',
      password: 'root',
    };

    const result = await api
      .post('/api/login')
      .send(userCredentials)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(result.body).toMatchObject({ email: 'root@root.com', name: 'rootname', surname: 'rootsurname' });
    expect(result.body).toHaveProperty('token');
  });
});

afterAll(() => {
  mongoose.connection.close();
});
