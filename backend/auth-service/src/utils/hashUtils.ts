import bcrypt from "bcrypt";

//Hash the password
export async function hashPassword(password: string): Promise<string> {
  try {
    return bcrypt.hash(password, 10);
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
}

export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean | string> {
  try {
    return bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
}