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
