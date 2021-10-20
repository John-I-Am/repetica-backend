/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { ExistingUser } from '../types';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  surname: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  passwordHash: String,
});

userSchema.plugin(uniqueValidator);

userSchema.set('toJSON', {
  transform: (_document: any, returnedObject: any) => {
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

export default mongoose.model<ExistingUser>('User', userSchema);
