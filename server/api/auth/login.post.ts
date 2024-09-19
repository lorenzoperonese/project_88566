export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log(body)

  if (body.username == body.password) {
    return { token: "castorone" }
  } else {
    throw createError({
      status: 401,
      statusText: "Username or password are wrong"
    })
  }
})
