import { User, Settings } from '@/server/db'

interface RegisterUser {
  username: string
  name: string
  password: string
}

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as RegisterUser

  console.log('Registering user: ', body)

  if (!body.username) {
    setResponseStatus(event, 400)
    return {
      code: 'USERNAME_REQUIRED',
      err: 'Body malformed: username is required.'
    }
  }

  if (!body.password) {
    setResponseStatus(event, 400)
    return {
      code: 'PASSWORD_REQUIRED',
      err: 'Body malformed: password is required.'
    }
  }

  if (!body.name) {
    setResponseStatus(event, 400)
    return {
      code: 'NAME_REQUIRED',
      err: 'Body malformed: name is required.'
    }
  }

  let needAdmin = false
  const admin = await User.findOne({ admin: true })
  if (!admin) {
    needAdmin = true
  }

  try {
    const user = new User({
      username: body.username,
      password: body.password,
      name: body.name,
      avatar: getRandomAvatar(),
      admin: needAdmin
    })

    await user.save()

    const s = new Settings({
      user_id: user._id,
      home: {
        showCalendar: true,
        showNotes: true,
        showPomodoro: true,
        showChat: true,
        showProjects: true,
        calendarFilter: 'all',
        notesFilter: 'all',
        pomodoroShowTimeIfPaused: true,
        chatShowHub: true,
        chatLimit: 10,
        projectsLimit: 10
      }
    })

    await s.save()

    return { message: 'User created successfully' }
  } catch (err) {
    console.error(err)
    setResponseStatus(event, 500)
    return { err }
  }
})
