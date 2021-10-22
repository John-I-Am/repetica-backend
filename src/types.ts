/* eslint-disable no-shadow */
export interface ExistingUser {
  email: string
  name: string,
  surname: string,
  passwordHash: string,
}

export interface NewUser {
  email: string,
  name: string,
  surname: string,
  password: string,
}

export interface UserCredential {
  email: string,
  password: string,
}

export interface ExistingCard {
  front: string,
  back: string,
  level: number,
  date: Date,
}

export interface NewCard {
  front: string,
  back: string,
  level: number,
}

export interface decodedToken {
  email: string,
  id: string,
}

export enum Level {
  One = 1,
  Two = 2,
  Three = 3,
  Four = 4,
  Five = 5,
}
