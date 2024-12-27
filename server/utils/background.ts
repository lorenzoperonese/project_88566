import { Task, ProjectTask, PomodoroEvent } from '@/server/db'

// Move all non-completed tasks to the next day
export async function updateTasks(): Promise<void> {
  const today = await getNowTime()

  await Task.updateMany(
    {
      completed: false,
      end: {
        $lt: today
      }
    },
    [
      {
        // Calculates how many days have passed since the task's end date ($subtract: [today, "$end"])
        // Divides by milliseconds in a day to get number of days
        // Rounds up to the nearest day ($ceil)
        // Multiplies by milliseconds in a day to get the total time to add
        // Adds this to the original end date
        $set: {
          end: {
            // Calculate days passed and add that many days to the original end date
            $add: [
              '$end',
              {
                $multiply: [
                  {
                    $ceil: {
                      $divide: [
                        { $subtract: [today, '$end'] },
                        24 * 60 * 60 * 1000 // milliseconds in a day
                      ]
                    }
                  },
                  24 * 60 * 60 * 1000 // milliseconds in a day
                ]
              }
            ]
          }
        }
      }
    ]
  )
}

// Set projects tasks that are in_progress and have passed their end date to 'late'
export async function updateProjectTasks(): Promise<void> {
  const today = await getNowTime()

  await ProjectTask.updateMany(
    {
      end: { $lt: today },
      state: 'in_progress'
    },
    {
      state: 'late'
    }
  )
}

// Move pomodoros that are in the past to the next day if cycles are not 0
export async function updatePomodoros(): Promise<void> {
  const today = await getNowTime()

  const startOfToday = new Date(today).setHours(0, 0, 0, 0)

  const outdatedPomodoros = await PomodoroEvent.find({
    date: { $lt: startOfToday },
    cycles: { $gt: 0 }
  })

  for (const pomodoro of outdatedPomodoros) {
    const pomodoroDay = new Date(pomodoro.date).setHours(0, 0, 0, 0)

    const daysDiff = Math.ceil(
      (startOfToday - pomodoroDay) / (24 * 60 * 60 * 1000)
    )

    const newDate = pomodoroDay + daysDiff * 24 * 60 * 60 * 1000

    await PomodoroEvent.updateOne(
      { _id: pomodoro._id },
      {
        $set: { date: newDate }
      }
    )
  }
}
