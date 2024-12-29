import { ProjectTask, Project } from '@/server/db'

export default defineEventHandler(async (event): Promise<ProjectEvent[]> => {
  try {
    const r = await ProjectTask.find({ user_id: event.context.auth.id })
    if (!r) {
      setResponseStatus(event, 404)
      return []
    }

    // Use Promise.all to wait for all the async operations to complete
    return await Promise.all(
      r.map(async (v) => {
        const p = await Project.findById(v.project_id)
        return {
          id: v.id.toString(),
          task_name: v.title,
          project_id: v.project_id.toString(),
          project_name: p ? p.title : 'Unavailable',
          start: v.start,
          end: v.end
        } as ProjectEvent
      })
    )
  } catch (e) {
    console.error(e)
    setResponseStatus(event, 500)
    return []
  }
})
