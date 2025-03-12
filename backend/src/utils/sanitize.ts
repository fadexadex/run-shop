import { Prisma } from "@prisma/client";
import { generateToken } from "./jwt";

const sanitizeUserAndGrantToken = (data: Prisma.UserCreateInput) => {
  const payload = {
    id: data.id,
    email: data.email,
    role: data.role,
  };
  return { token: generateToken(payload) };
};

export default sanitizeUserAndGrantToken;
