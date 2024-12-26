import { Task, ProjectTask } from '@/server/db'

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
