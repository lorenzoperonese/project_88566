import { getAuthSession } from "@/server/utils/session";

export default defineEventHandler(async (event) => {
  console.log(event.node.req.url);

  if (event.node.req.url?.startsWith("/api")) {
    const token = getCookie(event, "auth:token")
    console.log("TOKEN:", token);

    if (!token) {
      setResponseStatus(event, 401);
      return {
        err: "Unauthenticated"
      }
    }

    const s = await getAuthSession(token);
    if (!s) {
      setResponseStatus(event, 401);
      return {
        err: "Cookie for auth is not valid or expired"
      };
    }
  }
})
