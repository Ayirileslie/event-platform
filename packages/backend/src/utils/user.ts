import bcrypt from "bcryptjs";
import { getItem, putItem } from "../lib/db";

export const getUserByEmail = (email: string) => getItem(`USER#${email}`, "METADATA");

export const createUser = async (email: string, password: string, role: "organizer" | "attendee") => {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = { pk: `USER#${email}`, sk: "METADATA", email, passwordHash, role };
  await putItem(user);
  return user;
};
