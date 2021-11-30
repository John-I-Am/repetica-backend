import jwt from 'jsonwebtoken';
import Deck from '../models/deck';
import User from '../models/user';
import { DecodedToken, ExistingDeck, ExistingUser } from '../types';

const getAllDecks = async (token: string): Promise<ExistingDeck[] | false> => {
  const decodedResult = jwt.verify(token, process.env.SECRET as string) as DecodedToken;
  if (!token || !decodedResult.id) {
    return false;
  }

  const decks: ExistingDeck[] = await Deck.find({ user: decodedResult.id }).populate('cards');
  return decks;
};

const createDeck = async (token: string): Promise<ExistingDeck | false | null> => {
  const decodedResult = jwt.verify(token, process.env.SECRET as string) as DecodedToken;
  if (!token || !decodedResult.id) {
    return false;
  }

  const user: ExistingUser | null = await User.findById(decodedResult.id);
  if (!user) {
    return null;
  }

  const deck: ExistingDeck = new Deck({
    title: 'New Deck', creationDate: new Date(),
  });

  deck.user = user.id;

  const savedDeck = await deck.save();
  user.decks = user.decks.concat(savedDeck.id);
  await user.save();
  return savedDeck;
};

const updateDeck = async (deck: any, deckId: string, token: string)
: Promise<ExistingDeck | false | null> => {
  const decodedResult = jwt.verify(token, process.env.SECRET as string) as DecodedToken;
  if (!token || !decodedResult.id) {
    return false;
  }

  const result: ExistingDeck | null = await Deck.findByIdAndUpdate(deckId, { title: deck.title },
    { new: true }).populate('cards');

  return result;
};

const deleteDeck = async (id: string, token: string)
  : Promise<ExistingDeck | false | null> => {
  const decodedResult = jwt.verify(token, process.env.SECRET as string) as DecodedToken;
  if (!token || !decodedResult.id) {
    return false;
  }

  const result: ExistingDeck | null = await Deck.findByIdAndRemove(id);
  return result;
};

export default {
  getAllDecks,
  createDeck,
  deleteDeck,
  updateDeck,
};
