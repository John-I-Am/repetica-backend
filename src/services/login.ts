/* eslint-disable no-underscore-dangle */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { ExistingUser, UserCredential, Token } from '../types';

const fetchUser = async (userToFetch: UserCredential): Promise<Token |false> => {
  const user: ExistingUser | null = await User.findOne({ email: userToFetch.email });
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(userToFetch.password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return false;
  }
  const userForToken = {
    email: user.email,
    id: user._id,
  };

  const token: string = jwt.sign(
    userForToken, process.env.SECRET as string, { expiresIn: 60 * 60 },
  );

  return {
    token,
    email: user.email,
    name: user.name,
    surname: user.surname,
  };
};

export default fetchUser;
