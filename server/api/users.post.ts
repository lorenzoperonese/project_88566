import { User } from "../db";

export default defineEventHandler(async (_) => {
  try {
    const user = new User({
      username: "samu",
      password: "samu",
      name: "Samuele",
    })

    await user.save()
    return { message: "User created successfuly" };
  } catch (err) {
    console.error(err);
    return { err }
  }
});
