/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';
import { ExistingCard } from '../types';

const cardSchema: mongoose.Schema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  auxiliary: {
    type: Object,
    required: true,
  },
  front: {
    type: Object,
    required: true,
  },
  back: {
    type: Object,
    required: true,
  },
  level: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  creationDate: {
    type: Date,
    required: true,
  },
  checkpointDate: {
    type: Date,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  deckId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deck',
  },
});

cardSchema.set('toJSON', {
  transform: (_document: unknown, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default mongoose.model<ExistingCard>('Card', cardSchema);
