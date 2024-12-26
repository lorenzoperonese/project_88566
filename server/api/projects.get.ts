import { Project } from '@/server/db'
import type { IProject, IUser } from '@/server/db'
import type { Types, FlattenMaps } from 'mongoose'

type PopulatedProject = FlattenMaps<
  Omit<IProject, 'guests'> & {
    guests: {
      waiting: FlattenMaps<IUser>[]
      accepted: FlattenMaps<IUser>[]
    }
  }
>

export default defineEventHandler(async (event): Promise<Project[]> => {
  try {
    const projects = await Project.find({
      $or: [
        { user_id: event.context.auth.id },
        { 'guests.waiting': event.context.auth.id },
        { 'guests.accepted': event.context.auth.id }
      ]
    })
      .populate<{ 'guests.waiting': IUser[] }>('guests.waiting')
      .populate<{ 'guests.accepted': IUser[] }>('guests.accepted')
      .lean<PopulatedProject[]>()

    return projects.map(
      (project): Project => ({
        id: (project._id as Types.ObjectId).toString(),
        title: project.title,
        description: project.description,
        tasks: [],
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
