/* eslint-disable no-shadow */
import mongoose from 'mongoose';

export interface ExistingUser extends mongoose.Document {
  email: string
  name: string,
  surname: string,
  passwordHash: string,
  cards: Array<string>,
  decks: Array<string>,
}

export interface NewUser {
  email: string,
  name: string,
  surname: string,
  password: string,
}

export interface UpdatedUser {
  email: string,
  name: string,
  surname: string,
  currentPassword: string,
  newPassword: string,
}

export interface UserCredential {
  email: string,
  password: string,
}

export interface ExistingDeck extends mongoose.Document {
  title: string,
  creationDate: Date,
  cards: Array<string>,
  user: string,
}

export interface ExistingCard extends mongoose.Document {
  type: string,
  deckId: string,
  auxiliary: object,
  front: Object
  back: Object,
  level: number,
  creationDate: Date,
  checkpointDate: Date,
}

export interface NewCard {
  type: string,
  deckId: string,
  auxiliary: object,
  front: Object,
  back: Object,
  level: number,
}

export interface DecodedToken {
  email: string,
  id: string,
}

export enum Level {
  zero = 0,
  One = 1,
  Two = 2,
  Three = 3,
  Four = 4,
  Five = 5,
}
