import { User } from "@/server/db"
import { newSession } from "@/server/utils/session";

interface IRequestBody {
  username: string;
  password: string;
}

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody<IRequestBody>(event);
  console.log("Try login: ", { username, password });

  if (!username) {
    setResponseStatus(event, 400);
    return {
      code: "USERNAME_REQUIRED",
      err: "Body malformed: username is required."
    };
  }

  if (!password) {
    setResponseStatus(event, 400);
    return {
      code: "PASSWORD_REQUIRED",
      err: "Body malformed: password is required."
    };
  }

  try {
    console.log("Searching user:", username);
    const userData = await User.findOne({
      username: username.toLowerCase()
    });

    const err_not_found = {
      code: "USER_NOT_FOUND",
      err: "User with given username and password does not exists"
    };

    if (!userData) {
      console.log("User not found")
      setResponseStatus(event, 404);
      return err_not_found;
    }

    console.log("User found");
    const is_password_valid = await userData.verifyPassword(password);
    if (!is_password_valid) {
      console.log("Password is not valid");
      setResponseStatus(event, 404);
      return err_not_found;

    }

    // Generating new session for user
    const token = await newSession(userData._id as string, userData.username);
    console.log(token)

    console.log(username, "logged in");
    return {
      token: token,
      user: {
        id: userData._id,
        username: userData.username,
        name: userData.name
      }
    };
  } catch (err) {
    console.error(err);
    setResponseStatus(event, 500);
    return { err }
  }
})
