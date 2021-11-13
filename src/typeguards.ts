import { NewCard, NewUser, UserCredential } from './types';

const isString = (text: unknown): text is string => typeof text === 'string' || text instanceof String;

const isNumber = (value: unknown): value is number => typeof value === 'number';

// const isDate = (date: string): boolean => Boolean(Date.parse(date));

const parseContent = (content: unknown): string => {
  const error = new Error('Incorrect type or missing content');
  error.name = 'ParseError';
  if (!content || !isString(content)) {
    throw error;
  }

  return content;
};

// const parseDate = (date: unknown): string => {
//   if (!date || !isString(date) || !isDate(date)) {
//     throw new Error('Incorrect or missing date');
//   }
//   return date;
// };

const parseLevel = (level: unknown): number => {
  const error = new Error('Incorrect type or level out of range');
  error.name = 'ParseError';
  if (!isNumber(level) || (level < 0 || level > 5)) {
    throw error;
  }
  return level;
};

const toNewCard = (object: any): NewCard => {
  const newCard: NewCard = {
    front: parseContent(object.front),
    back: parseContent(object.back),
    level: parseLevel(object.level),
  };

  return newCard;
};

const toUserCredential = (object: any): UserCredential => {
  const userCredential: UserCredential = {
    email: parseContent(object.email),
    password: parseContent(object.password),
  };

  return userCredential;
};

const toNewUser = (object: any): NewUser => {
  const newUser: NewUser = {
    email: parseContent(object.email),
    name: parseContent(object.name),
    surname: parseContent(object.surname),
    password: parseContent(object.password),
  };

  return newUser;
};

export default { toNewCard, toUserCredential, toNewUser };
