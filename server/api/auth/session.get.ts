import { getSession } from "@/server/utils/session";

export default defineEventHandler(async (event) => {
  const token = getCookie(event, "auth:token")
  console.log("TOKEN:", token);

  if (!token) {
    setResponseStatus(event, 401);
    return {
      err: "Unauthenticated"
    }
  }

  const s = await getSession(token);
  if (!s) {
    setResponseStatus(event, 401);
    return {
      err: "Cookie for auth is not valid or expired"
    }
  }

  return { s }
})
