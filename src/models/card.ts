/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';
import { ExistingCard } from '../types';

const cardSchema: mongoose.Schema = new mongoose.Schema({
  front: {
    type: String,
    required: true,
  },
  back: {
    type: String,
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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
