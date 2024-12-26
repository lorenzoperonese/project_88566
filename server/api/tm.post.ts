import { ProjectTask } from '@/server/db'

export default defineEventHandler(async (event) => {
  const body = await readBody<number>(event)
  console.log('body:', body)

  const delta = body - Date.now()

  await useStorage().setItem<number>(`tm:delta`, delta)

  const now = await getNowTime()

  // For project tasks that are in_progress, update their status to 'late'
  await ProjectTask.updateMany(
    {
      end: { $lt: now },
      state: 'in_progress'
    },
    {
      state: 'late'
    }
  )
})
