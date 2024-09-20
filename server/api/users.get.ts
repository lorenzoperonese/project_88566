import { User } from "../db";

export default defineEventHandler(async (_) => {
  try {
    const users_data = await User.find();
    console.log(users_data);
    return users_data.map((u) => ({
      id: u._id,
      username: u.username,
      name: u.name,
    }));
  } catch (err) {
    console.error(err);
  }
});
