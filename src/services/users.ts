import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import {
  DecodedToken, ExistingUser, NewUser, UpdatedUser,
} from '../types';

const addUser = async (user: NewUser): Promise<ExistingUser | false> => {
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(user.password, saltRounds);

  const emails = ((await User.find({})).map((ele:any) => ele.email));
  if (!emails.includes(user.email)) {
    const newUser: ExistingUser = new User({
      email: user.email,
      name: user.name,
      surname: user.surname,
      passwordHash,
    });

    const savedUser: ExistingUser = await newUser.save();
    savedUser.populate('cards');
    return savedUser;
  }
  return false;
};

const getUser = async (token: string)
  : Promise<ExistingUser | null | false> => {
  const decodedResult = jwt.verify(token, process.env.SECRET as string) as DecodedToken;
  if (!token || !decodedResult.id) {
    return false;
  }

  const user: ExistingUser | null = await User.findOne({ _id: decodedResult.id }).populate('cards');
  return user;
};

const updateUser = async (updatedUser: UpdatedUser, token: string):
  Promise<ExistingUser | false | undefined | null> => {
  const decodedResult = jwt.verify(token, process.env.SECRET as string) as DecodedToken;
  if (!token || !decodedResult.id) {
    return false;
  }

  const currentUser: ExistingUser | null = await User.findById(decodedResult.id);
  let newPasswordHash = currentUser?.passwordHash;
  if (updatedUser.newPassword != null) {
    const saltRounds = 10;
    newPasswordHash = await bcrypt.hash(updatedUser.newPassword, saltRounds);

    const passwordCorrect = currentUser === null
      ? false
      : await bcrypt.compare(updatedUser.currentPassword, currentUser.passwordHash);

    if (!(currentUser && passwordCorrect)) {
      return false;
    }
  }

  const emails = (await User.find({})).map((user: any) => user.email);
  if (updatedUser !== null && emails.includes(updatedUser.email)) {
    return null;
  }

  const newUser = await User.findByIdAndUpdate(decodedResult.id,
    {
      name: updatedUser.name,
      surname: updatedUser.surname,
      email: updatedUser.email,
      passwordHash: newPasswordHash,
    },
    { new: true }).populate('cards');

  return newUser;
};

export default { addUser, updateUser, getUser };
