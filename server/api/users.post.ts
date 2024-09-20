import { User } from "@/server/db";

export default defineEventHandler(async (event) => {
  try {
    const user = new User({
      username: "samu",
      password: "samu",
      name: "Samuele",
    });

    await user.save();
    return { message: "User created successfuly" };
  } catch (err) {
    console.error(err);
    setResponseStatus(event, 500);
    return { err };
  }
});
