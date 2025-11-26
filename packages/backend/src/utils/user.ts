// packages/backend/src/utils/user.ts
import bcrypt from "bcryptjs";
import { getItem, putItem } from "../lib/db";

export const getUserByEmail = (email: string) =>
  getItem(`USER#${email.toLowerCase()}`, "METADATA");

export const createUser = async (
  email: string,
  password: string,
  role: "organizer" | "attendee" = "attendee"
) => {
  const passwordHash = await bcrypt.hash(password, 12);
  const user = {
    PK: `USER#${email.toLowerCase()}`,
    SK: "METADATA",
    email: email.toLowerCase(),
    passwordHash,
    role,
    createdAt: new Date().toISOString(),
  };
  await putItem(user);
  return user;
};
