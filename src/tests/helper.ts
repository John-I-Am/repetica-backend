/* eslint-disable no-underscore-dangle */
import User from '../models/user';
import Card from '../models/card';

const nonExistingId = async () => {
  const card = new Card({
    front: 'front', back: '[]', level: 1,
  });
  await card.save();
  await card.remove();

  return card._id.toString();
};

const cardsInDb = async () => {
  const cards = await Card.find({});
  return cards.map((card) => card.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

export default {
  nonExistingId,
  cardsInDb,
  usersInDb,
};
