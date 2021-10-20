import bcrypt from 'bcrypt';
import User from '../models/user';
import { NewUser } from '../types';

const addUser = async (user: NewUser) => {
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(user.password, saltRounds);

  const newUser = new User({
    email: user.email,
    name: user.name,
    surname: user.surname,
    passwordHash,
  });

  const savedUser = await newUser.save();
  return savedUser;
};

export default { addUser };
