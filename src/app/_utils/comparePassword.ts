import brcypt from "bcrypt";

export default async function comparePassword (password: string, hashedPassword: string): Promise<boolean> {
  return await brcypt.compare(password, hashedPassword);
}