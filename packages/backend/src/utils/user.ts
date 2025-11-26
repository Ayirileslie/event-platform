import bcrypt from "bcryptjs";
import { getItem, putItem } from "../lib/db";

export const getUserByEmail = (email: string) =>
  getItem(`USER#${email.toLowerCase()}`, "METADATA");

export const createUser = async (
  email: string,
  password: string,
  role: "organizer" | "attendee" = "attendee",
  name?: string
) => {
  const passwordHash = await bcrypt.hash(password, 12);
  const user = {
    PK: `USER#${email.toLowerCase()}`,
    SK: "METADATA",
    email: email.toLowerCase(),
    name: name || email.split('@')[0],
    passwordHash,
    role,
    createdAt: new Date().toISOString(),
  };
  await putItem(user);
  return user;
};
