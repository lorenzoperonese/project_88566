export default defineEventHandler(async (_): Promise<number> => {
  return await getNowTime()
})
