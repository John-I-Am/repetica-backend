/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';
// import uniqueValidator from 'mongoose-unique-validator';
import { ExistingUser } from '../types';

const userSchema: mongoose.Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    // unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  cards: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Card',
    },
  ],
});

// userSchema.plugin(uniqueValidator);

userSchema.set('toJSON', {
  transform: (_document: any, returnedObject: any) => {
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

export default mongoose.model<ExistingUser>('User', userSchema);
