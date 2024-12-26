import { Project, User } from '@/server/db'
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

export default defineEventHandler(async (event): Promise<Project | Object> => {
  try {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw Error('ID is undefined')
    }

    const user = await User.findById(event.context.auth.id)
    if (!user) {
      setResponseStatus(event, 404)
      return {}
    }

    const project = await Project.findOne({
      _id: id
    })
      .populate<{ 'guests.waiting': IUser[] }>('guests.waiting')
      .populate<{ 'guests.accepted': IUser[] }>('guests.accepted')
      .lean<PopulatedProject>()

    console.log(project)

    console.log(project?.user_id)
    console.log(event.context.auth.id)
    console.log(project?.guests.waiting)
    console.log(project?.guests.accepted)

    if (
      !project ||
      (project.user_id.toString() !== event.context.auth.id &&
        !project.guests.accepted.some((g) => g.username === user.username) &&
        !project.guests.waiting.some((g) => g.username === user.username))
    ) {
      setResponseStatus(event, 404)
      return {}
    }

    console.log(project)

    return {
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
    } as Project
  } catch (err) {
    console.error(err)
    return { err }
  }
})
