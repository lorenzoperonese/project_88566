export default defineEventHandler((event) => {
  const cookie = getCookie(event, "auth:token")
  console.log("TOKEN:", cookie);

  if (cookie == "castorone") {
    return { id: 1, username: "samu" }
  } else {
    throw createError({
      status: 401,
    })
  }
})
