import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import {
  DecodedToken, ExistingUser, NewUser, UpdatedUser,
} from '../types';

const addUser = async (user: NewUser): Promise<any> => {
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
    return savedUser;
  }
  return { error: 'email not unique' };
};

const fetchInfo = async (token: string | null) => {
  const decodedResult = jwt.verify(token as string, process.env.SECRET as string) as DecodedToken;
  if (!token || !decodedResult.id) {
    return { error: 'token missing or invalid' };
  }

  const info = await User.findOne({ _id: decodedResult.id });

  return info;
};

const updateUser = async (updatedUser: UpdatedUser, token: string): Promise<any> => {
  const decodedResult = jwt.verify(token as string, process.env.SECRET as string) as DecodedToken;
  if (!token || !decodedResult.id) {
    return { error: 'token missing or invalid' };
  }

  const currentUser: any = await User.findById(decodedResult.id);

  let newPasswordHash = currentUser.passwordHash;

  if (updatedUser.newPassword != null) {
    const saltRounds = 10;
    newPasswordHash = await bcrypt.hash(updatedUser.newPassword, saltRounds);

    const passwordCorrect = currentUser === null
      ? false
      : await bcrypt.compare(updatedUser.currentPassword, currentUser.passwordHash);

    if (!(currentUser && passwordCorrect)) {
      return { error: 'Incorrect Password' };
    }
  }

  const emails = (await User.find({})).map((ele:any) => ele.email);

  if (updatedUser !== null && emails.includes(updatedUser.email)) {
    return { error: 'email not unique' };
  }

  const user = await User.findByIdAndUpdate(decodedResult.id,
    {
      name: updatedUser.name,
      surname: updatedUser.surname,
      email: updatedUser.email,
      passwordHash: newPasswordHash,
    },
    { new: true });

  return user;
};

export default { addUser, updateUser, fetchInfo };
