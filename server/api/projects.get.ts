import { Project } from '@/server/db'
import type { IProject, IProjectTask, IUser } from '@/server/db'
import type { Types, FlattenMaps } from 'mongoose'

type PopulatedProject = FlattenMaps<
  Omit<IProject, 'guests'> & {
    tasks: FlattenMaps<IProjectTask>[]
    guests: {
      waiting: FlattenMaps<IUser>[]
      accepted: FlattenMaps<IUser>[]
    }
  }
>

export default defineEventHandler(async (event): Promise<Project[]> => {
  try {
    const projects = await Project.find({
      user_id: event.context.auth.id
    })
      .populate<{ tasks: IProjectTask[] }>('tasks')
      .populate<{ 'guests.waiting': IUser[] }>('guests.waiting')
      .populate<{ 'guests.accepted': IUser[] }>('guests.accepted')
      .lean<PopulatedProject[]>()

    return projects.map(
      (project): Project => ({
        id: (project._id as Types.ObjectId).toString(),
        title: project.title,
        description: project.description,
        tasks: project.tasks.map((task) => ({
          id: (task._id as Types.ObjectId).toString(),
          title: task.title,
          description: task.description,
          phase: task.phase,
          user_id: task.user_id.toString(),
          state: task.state,
          start: task.start,
          end: task.end,
          dependencies: task.dependencies.map((dep) => dep.toString()),
          project_id: task.project_id.toString()
        })),
        guests: {
          waiting: project.guests.waiting.map((guest) => ({
            id: (guest._id as Types.ObjectId).toString(),
            username: guest.username,
            name: guest.name,
            avatar: guest.avatar,
            theme: guest.theme
          })),
          accepted: project.guests.accepted.map((guest) => ({
            id: (guest._id as Types.ObjectId).toString(),
            username: guest.username,
            name: guest.name,
            avatar: guest.avatar,
            theme: guest.theme
          }))
        },
        user_id: project.user_id.toString()
      })
    )
  } catch (err) {
    console.error(err)
    return []
  }
})
