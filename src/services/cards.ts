/* eslint-disable no-underscore-dangle */
import jwt from 'jsonwebtoken';
import Card from '../models/card';
import User from '../models/user';
import { NewCard, decodedToken } from '../types';

const getAllCards = async (token: string | null) => {
  const decodedResult = jwt.verify(token as string, process.env.SECRET as string) as decodedToken;
  if (!token || !decodedResult.id) {
    return false;
  }

  const cards = await Card.find({ user: decodedResult.id });

  // const cards = await Card.find({}).populate('user', { username: 1, name: 1 });
  return cards;
};

const getCardById = async (id: string) => {
  const card = await Card.findById(id);
  return card;
};

const postCard = async (cardToPost: NewCard, token: string | null) => {
  const decodedResult = jwt.verify(token as string, process.env.SECRET as string) as decodedToken;
  if (!token || !decodedResult.id) {
    return false;
  }

  const user = await User.findById(decodedResult.id) as any;

  const card = new Card({
    ...cardToPost, creationDate: new Date(), checkpointDate: new Date(), user: user._id,
  });

  const savedCard = await card.save();
  user.cards = user.cards.concat(savedCard._id);
  await user.save();
  return savedCard;
};

const deleteCard = async (id: string) => {
  await Card.findByIdAndRemove(id);
};

const updateCard = async (updatedCard: NewCard, id: string) => {
  const result = Card.findByIdAndUpdate(id, { ...updatedCard }, { new: true });
  return result;
};

export default {
  getAllCards, getCardById, postCard, deleteCard, updateCard,
};
