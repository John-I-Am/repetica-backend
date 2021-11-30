import { Request } from 'express';

export const getTokenFrom = (request: Request): any => {
  const authorization: string | undefined = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

export const temp = 'temp';
