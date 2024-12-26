import { updateTasks, updateProjectTasks } from '../utils/background'

export default defineEventHandler(async (event) => {
  const body = await readBody<number>(event)
  console.log('body:', body)

  const delta = body - Date.now()

  await useStorage().setItem<number>(`tm:delta`, delta)

  await updateTasks()
  await updateProjectTasks()
})
