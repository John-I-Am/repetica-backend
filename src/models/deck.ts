/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';
import { ExistingDeck } from '../types';

const deckSchema: mongoose.Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
    required: true,
  },
  cards: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Card',
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

});

deckSchema.set('toJSON', {
  transform: (_document: any, returnedObject: any) => {
    delete returnedObject.__v;
  },
});

export default mongoose.model<ExistingDeck>('Deck', deckSchema);
