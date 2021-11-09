import bcrypt from 'bcrypt';
import User from '../models/user';
import { ExistingUser, NewUser } from '../types';

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

export default { addUser };
