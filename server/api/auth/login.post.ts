import { User } from "@/server/db"

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
    console.debug("Searching user:", username);
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

    console.debug("User found");
    const is_password_valid = await userData.verifyPassword(password);
    if (is_password_valid) {
      console.log(username, "logged in");
      return {
        id: userData._id,
        username: userData.username,
        name: userData.name
      };
    } else {
      console.log("Password is not valid");
      setResponseStatus(event, 404);
      return err_not_found;
    };
  } catch (err) {
    console.error(err);
    setResponseStatus(event, 500);
    return { err }
  }
})
