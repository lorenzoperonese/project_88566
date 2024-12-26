import { ProjectTask } from '@/server/db'

export default defineEventHandler(async () => {
  await useStorage().setItem<number>(`tm:delta`, 0)

  const now = await getNowTime()

  await ProjectTask.updateMany(
    {
      end: { $gt: now },
      state: 'late'
    },
    {
      state: 'in_progress'
    }
  )
})
