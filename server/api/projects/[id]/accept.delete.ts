import { Project, Notification } from '@/server/db'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw Error('ID is undefined')
    }

    const project = await Project.findOne({
      _id: id
    })

    if (
      !project ||
      (project.user_id.toString() !== event.context.auth.id &&
        !project.guests.accepted.includes(event.context.auth.id) &&
        !project.guests.waiting.includes(event.context.auth.id))
    ) {
      setResponseStatus(event, 404)
      return
    }

    project.guests.waiting = project.guests.waiting.filter(
      (g) => g.toString() !== event.context.auth.id
    )

    await project.save()

    await Notification.findOneAndUpdate(
      {
        type: 'project-invited',
        identifier: id,
        user_id: event.context.auth.id
      },
      {
        read: true
      }
    )
  } catch (err) {
    console.error(err)
    setResponseStatus(event, 500)
    return { err }
  }
})
