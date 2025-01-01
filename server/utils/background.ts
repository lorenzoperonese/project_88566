import { Task, ProjectTask, PomodoroEvent, type IEvent } from '@/server/db'

// Move all non-completed tasks to the next day
export async function updateTasks(): Promise<void> {
  const today = await getNowTime()

  const filter = {
    completed: false,
    end: {
      $lt: today
    }
  }

  const tasks = await Task.find(filter)
  for (const t of tasks) {
    let message = `Task "${t.title}" has been postponed to the next day`
    if (t.postponed) message += ` ${t.postponed + 1} times`

    let users = t.users.map((u) => u.toString())
    users.push(t.user_id.toString())

    const n = {
      id: '0',
      title: 'Task Postponed',
      body: message,
      users: users,
      event_id: t._id,
      type: 'task'
    } as PushNotification

    sendPushNotification(n)
  }

  await Task.updateMany(filter, [
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
        },
        postponed: {
          $add: ['$postponed', 1]
        }
      }
    }
  ])
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

// This part is for the notification array

export class Notificator {
  private notifications: PushNotification[] = []
  private notificationStates: PushNotificationState[] = []

  public getNotifications(): PushNotification[] {
    return this.notifications
  }

  public getNotificationState(
    notification_id: string
  ): PushNotificationState | undefined {
    return this.notificationStates.find(
      (state) => state.notification_id === notification_id
    )
  }

  public removeNotificationById(id: string): void {
    this.notifications = this.notifications.filter(
      (notification) => notification.id !== id
    )
  }

  public removeNotificationsByEventId(eventId: string): void {
    this.notifications = this.notifications.filter(
      (notification) => notification.event_id !== eventId
    )
  }

  private convertToMilliseconds(
    notification: Pick<Notify, 'advance' | 'period'>
  ): number {
    const multipliers = {
      1: 60 * 1000, // minutes
      2: 60 * 60 * 1000, // hours
      3: 24 * 60 * 60 * 1000, // days
      4: 7 * 24 * 60 * 60 * 1000 // weeks
    }
    return (
      notification.advance *
      multipliers[notification.period as keyof typeof multipliers]
    )
  }

  public processEvents(
    events: IEvent[],
    currentTime: number
  ): PushNotification[] {
    const notificationsToSend: PushNotification[] = []

    events.forEach((event) => {
      if (!event.notify || event.notify.length === 0) return

      event.notify.forEach((notification, index) => {
        const notificationId = `${event.id}-${index}`
        const state = this.getNotificationState(notificationId)

        // Calculate when this notification should trigger
        const notificationTime =
          event.start - this.convertToMilliseconds(notification)

        // Check if it's time to send the initial notification
        if (
          !state &&
          currentTime >= notificationTime &&
          currentTime < event.start
        ) {
          notificationsToSend.push(
            this.createNotification(
              event,
              notification,
              notificationId,
              currentTime
            )
          )
          this.updateNotificationState(notificationId, event.id, currentTime)
        }

        // Handle repetitions
        if (notification.repeat && state) {
          const shouldSendRepeat = this.shouldSendRepeatNotification(
            notification,
            state,
            currentTime,
            notificationTime,
            event.start
          )

          if (shouldSendRepeat) {
            notificationsToSend.push(
              this.createNotification(
                event,
                notification,
                notificationId,
                currentTime
              )
            )
            this.updateNotificationState(notificationId, event.id, currentTime)
          }
        }
      })
    })

    return notificationsToSend
  }

  private createNotification(
    event: IEvent,
    notification: Notify,
    notification_id: string,
    today: number
  ): PushNotification {
    return {
      event_id: event.id,
      title: event.title,
      users: [event.user_id.toString()].concat(
        event.guests.accepted.map((guest) => guest.id.toString())
      ),
      id: notification_id,
      body: this.createNotificationMessage(event, notification, today)
    }
  }

  private createNotificationMessage(
    event: IEvent,
    notification: Notify,
    currentTime: number
  ): string {
    const timeUntilEvent = event.start - currentTime

    if (timeUntilEvent <= 60000) {
      // Less than 1 minute
      return `Event "${event.title}" starting now`
    }

    if (timeUntilEvent <= 3600000) {
      // Less than 1 hour
      const minutes = Math.ceil(timeUntilEvent / 60000)
      return `Event "${event.title}" starting in ${minutes} minute${minutes > 1 ? 's' : ''}`
    }

    if (timeUntilEvent <= 86400000) {
      // Less than 1 day
      const hours = Math.ceil(timeUntilEvent / 3600000)
      return `Event "${event.title}" starting in ${hours} hour${hours > 1 ? 's' : ''}`
    }

    if (timeUntilEvent <= 604800000) {
      // Less than 1 week
      const days = Math.ceil(timeUntilEvent / 86400000)
      return `Event "${event.title}" starting in ${days} day${days > 1 ? 's' : ''}`
    }

    const weeks = Math.ceil(timeUntilEvent / 604800000)
    return `Event "${event.title}" starting in ${weeks} week${weeks > 1 ? 's' : ''}`
  }

  private updateNotificationState(
    notification_id: string,
    event_id: string,
    currentTime: number
  ): void {
    let state = this.getNotificationState(notification_id)

    if (state) {
      state.last_sent = currentTime
      state.sent_count++
    } else {
      this.notificationStates.push({
        event_id,
        notification_id,
        last_sent: currentTime,
        sent_count: 1,
        responded: false
      })
    }
  }

  private shouldSendRepeatNotification(
    notification: Notify,
    state: PushNotificationState,
    currentTime: number,
    notificationTime: number,
    eventStart: number
  ): boolean {
    if (currentTime >= eventStart) return false

    const repeatInterval = this.convertToMilliseconds({
      advance: notification.repeat!.interval,
      period: notification.repeat!.intervalUnit
    })

    const timeSinceLastNotification = currentTime - state.last_sent

    // For "until response" notifications
    if (notification.repeat!.untilResponse) {
      return !state.responded && timeSinceLastNotification >= repeatInterval
    }

    // For count-based notifications
    return (
      state.sent_count < notification.repeat!.count &&
      timeSinceLastNotification >= repeatInterval
    )
  }

  public markAsResponded(eventId: string, notificationId: string): void {
    const state = this.notificationStates.find(
      (s) => s.notification_id === notificationId
    )
    if (state) {
      state.responded = true
    }
  }
}
