import { Task } from '@/server/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  console.log('Deleting note ID:', id)

  try {
    if (!id) {
      throw new Error('ID is not defined')
    }

    const t = await Task.findById(id)
    if (!t) {
      setResponseStatus(event, 404)
      return { err: 'Task not found' }
    }

    if (t.user_id.toString() !== event.context.auth.id) {
      await Task.findOneAndUpdate(
        {
          _id: id,
          users: { $in: [event.context.auth.id] }
        },
        {
          users: t.users.filter((u) => u.toString() !== event.context.auth.id)
        }
      )

      return { mgs: 'Deleted task' }
    }

    await Task.findOneAndDelete({
      _id: id,
      user_id: event.context.auth.id
    })

    for (const user of t.users) {
      sendNotification(
        'Task deleted',
        `Task "${t.title}" has been deleted`,
        user.toString(),
        'basic',
        undefined
      )
    }

    return { mgs: 'Deleted task' }
  } catch (err) {
    console.error(err)
    return { err: err }
  }
})
