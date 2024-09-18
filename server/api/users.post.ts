import { users } from "../db";

export default defineEventHandler(async (_) => {
  try {
    const username = "samu";
    const password = "samu";
    const name = "Samuele";
    await users.create({
      username,
      password,
      name,
    });

    return { message: "User created successfuly" };
  } catch (err) {
    console.error(err);
    throw createError({
      statusMessage: "Can't create user",
    });
  }
});
