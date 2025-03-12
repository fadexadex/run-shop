import * as argon2 from "argon2";

const hashPassword = async (password: string) => {
  const hash = await argon2.hash(password);
  return hash;
};

const comparePassword = async (password: string, hash: string) => {
  const match = await argon2.verify(hash, password);
  return match;
};

export { hashPassword, comparePassword };