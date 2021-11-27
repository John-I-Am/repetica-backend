/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
import jwt from 'jsonwebtoken';
import Deck from '../models/deck';
import User from '../models/user';
import { DecodedToken, ExistingDeck, ExistingUser } from '../types';

const getAllDecks = async (token: string | null): Promise<any> => {
  const decodedResult = jwt.verify(token as string, process.env.SECRET as string) as any;
  if (!token || !decodedResult.id) {
    return false;
  }

  const decks: ExistingDeck = await Deck.find({ user: decodedResult.id }).populate('cards');

  return decks;
};

const createDeck = async (token: string | null): Promise<any> => {
  const decodedResult = jwt.verify(token as string, process.env.SECRET as string) as DecodedToken;
  if (!token || !decodedResult.id) {
    return false;
  }

  const user: ExistingUser | null = await User.findById(decodedResult.id);
  const deck: any = new Deck({
    title: 'New Deck', creationDate: new Date(),
  });

  deck.user = user?._id;

  const savedDeck = await deck.save();
  user!.decks = user!.decks.concat(savedDeck._id);
  await user!.save();
  return savedDeck;
};

const updateDeck = async (deck: any, deckId: string, token: string | null): Promise<any> => {
  const decodedResult = jwt.verify(token as string, process.env.SECRET as string) as DecodedToken;
  if (!token || !decodedResult.id) {
    return false;
  }

  const result: any = await Deck.findByIdAndUpdate(deckId, { title: deck.title },
    { new: true });

  return result.populate('cards');
};

const deleteDeck = async (id: string, token: string | null): Promise<undefined | false> => {
  const decodedResult = jwt.verify(token as string, process.env.SECRET as string) as DecodedToken;
  if (!token || !decodedResult.id) {
    return false;
  }

  await Deck.findByIdAndRemove(id);
};

export default {
  getAllDecks,
  createDeck,
  deleteDeck,
  updateDeck,
};
