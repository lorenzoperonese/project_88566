import { Project, ProjectTask } from '@/server/db'
import { Types } from 'mongoose'

export default defineEventHandler(async (event): Promise<ProjectTask[]> => {
  const id = getRouterParam(event, 'id')

  try {
    let project = await Project.findById(id)

    if (!project) {
      throw Error('Project not found')
    }

    if (
      project.user_id.toString() !== event.context.auth.id ||
      !project.guests.accepted.includes(event.context.auth.id)
    ) {
      throw createError({
        statusCode: 403,
        message: 'Unauthorized'
      })
    }

    const tasks = await ProjectTask.find({ project_id: id })

    return tasks.map((task) => ({
      id: (task._id as Types.ObjectId).toString(),
      title: task.title,
      description: task.description,
      phase: task.phase,
      user_id: task.user_id.toString(),
      start: task.start,
      end: task.end,
      dependencies: task.dependencies.map((d) => d.toString()),
      project_id: task.project_id.toString()
    })) as ProjectTask[]
  } catch (err) {
    console.error(err)
    return []
  }
})
