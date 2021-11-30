import jwt from 'jsonwebtoken';
import Card from '../models/card';
import Deck from '../models/deck';
import User from '../models/user';
import {
  NewCard, DecodedToken, ExistingCard, ExistingUser, ExistingDeck,
} from '../types';

const getAllCards = async (token: string): Promise<ExistingCard[] | false > => {
  const decodedResult = jwt.verify(token, process.env.SECRET as string) as DecodedToken;
  if (!token || !decodedResult.id) {
    return false;
  }

  const cards: ExistingCard[] = await Card.find({ user: decodedResult.id });
  return cards;
};

const getCardById = async (id: string, token: string): Promise<ExistingCard | false | null> => {
  const decodedResult = jwt.verify(token, process.env.SECRET as string) as DecodedToken;
  if (!token || !decodedResult.id) {
    return false;
  }

  const card: ExistingCard | null = await Card.findById(id);

  if (!card) {
    return null;
  }
  return card;
};

const postCard = async (deckId: string, cardToPost: NewCard, token: string)
  : Promise<ExistingCard | false | null> => {
  const decodedResult = jwt.verify(token, process.env.SECRET as string) as DecodedToken;
  if (!token || !decodedResult.id) {
    return false;
  }

  const user: ExistingUser | null = await User.findById(decodedResult.id);
  const deck: ExistingDeck | null = await Deck.findById(deckId);
  if (!user || !deck) {
    return null;
  }

  const card: ExistingCard = new Card({
    ...cardToPost,
    creationDate: new Date(),
    checkpointDate: new Date(),
    userId: user.id,
    deckId: deck.id,
  });

  const savedCard = await card.save();
  deck.cards = deck.cards.concat(savedCard.id);
  user.cards = user.cards.concat(savedCard.id);
  await user.save();
  await deck.save();
  return savedCard;
};

const deleteCard = async (id: string, token: string): Promise<ExistingCard | null | false> => {
  const decodedResult = jwt.verify(token, process.env.SECRET as string) as DecodedToken;
  if (!token || !decodedResult.id) {
    return false;
  }

  const card: ExistingCard | null = await Card.findByIdAndRemove(id);
  return card;
};

const updateCard = async (updatedCard: NewCard, id: string, token: string)
  :Promise<ExistingCard | false | null> => {
  const decodedResult = jwt.verify(token, process.env.SECRET as string) as DecodedToken;
  if (!token || !decodedResult.id) {
    return false;
  }

  const cardToUpdate: ExistingCard | null = await Card.findById(id);
  if (!cardToUpdate) {
    return null;
  }

  const currentCheckpoint: number = cardToUpdate!.checkpointDate.getTime();
  let interval = 0;

  // formula for adding time: min * 60000
  switch (updatedCard.level) {
    case 0:
      interval = (15 * 60000);
      break;
    case 1:
      interval = (120 * 60000);
      break;
    case 2:
      interval = (480 * 60000);
      break;
    case 3:
      interval = (1440 * 60000);
      break;
    case 4:
      interval = (4320 * 60000);
      break;
    case 5:
      interval = (10080 * 60000);
      break;
    default:
      interval = 0;
      break;
  }

  const result: ExistingCard | null = await Card.findByIdAndUpdate(
    id, { ...updatedCard, checkpointDate: new Date(currentCheckpoint + (interval)) },
    { new: true },
  );

  return result;
};

export default {
  getAllCards, getCardById, postCard, deleteCard, updateCard,
};
