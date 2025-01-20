<script setup lang="ts">
const $props = defineProps<{
  event: EventType
}>()

function repetitionMessage(r: Repetition) {
  let message = ''
  if (r.every != 1) {
    let tmp
    switch (parseInt(r.period.toString())) {
      case 1:
        tmp = 'days'
        break
      case 2:
        tmp = 'weeks'
        break
      case 3:
        tmp = 'months'
        break
      default:
        tmp = 'years'
    }
    message = `Every ${r.every} ${tmp}`
  } else {
    switch (parseInt(r.period.toString())) {
      case 1:
        message = 'Daily'
        break
      case 2:
        message = 'Weekly'
        break
      case 3:
        message = 'Monthly'
        break
      default:
        message = 'Yearly'
    }
  }
  if (r.period == 2 && r.repeatOn && Array.isArray(r.repeatOn)) {
    message += ', on ' + r.repeatOn.map((e: number) => days[e]).join(', ')
  } else if (r.period == 3) {
    message += r.repeatOn == 1 ? ', on the same date' : `, on the same weekday`
  }
  if (r.endAfter) {
    message += `, for ${r.endAfter} time`
    message += r.endAfter == 1 ? '' : 's'
  } else if (r.endOn) {
    message += `, until ${formatDate(new Date(r.endOn).getTime())}`
  } else message += ', forever'
  return message
}

const periods = ['minute', 'hour', 'day', 'week']

function notifyMessage(i: Notify) {
  let message = ''
  let period = periods[i.period - 1]
  period += i.advance > 1 ? 's' : ''
  message += ` ${i.advance} ${period} before, `

  if (i.repeat) {
    if (i.repeat.untilResponse) {
      message += `repeating every ${i.repeat.interval} `
      let intervalUnit = periods[i.repeat.intervalUnit - 1]
      if (i.repeat.interval > 1) intervalUnit += 's'
      message += `${intervalUnit} until response,`
    } else {
      message += `, repeating ${i.repeat.count} times every ${i.repeat.interval} `
      let intervalUnit = periods[i.repeat.intervalUnit - 1]
      if (i.repeat.interval > 1) intervalUnit += 's'
      message += intervalUnit + ','
    }
  }
  message = message.slice(0, -2)
  return message
}
</script>

<template>
  <div class="flex items-center justify-center bg-base-200 p-4">
    <div class="w-full max-w-2xl rounded-xl bg-base-100 p-6 shadow-lg">
      <div class="mb-6 flex justify-center border-b border-base-300 pb-4">
        <h2 class="text-3xl font-bold text-base-content">
          {{ $props.event.title.toUpperCase() }}
        </h2>
      </div>

      <div class="mb-6 rounded-lg bg-base-200 p-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="flex items-center space-x-3">
            <div class="rounded-full bg-primary/20 p-2">
              <svg
                class="h-5 w-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <div class="text-sm text-base-content/70">Start</div>
              <div class="font-semibold text-base-content">
                {{ formatTime($props.event.start, true) }}
                <span class="ml-2">{{ formatDate($props.event.start) }}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <div class="rounded-full bg-secondary/20 p-2">
              <svg
                class="h-5 w-5 text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <div class="text-sm text-base-content/70">End</div>
              <div class="font-semibold text-base-content">
                {{ formatTime($props.event.end, true) }}
                <span class="ml-2">{{ formatDate($props.event.end) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-6 ml-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div class="flex items-center space-x-3">
          <div class="rounded-full bg-accent/20 p-2">
            <svg
              class="h-5 w-5 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div>
            <div class="text-sm text-base-content/70">Location</div>
            <div class="font-semibold text-base-content">
              {{ $props.event.location ? $props.event.location : 'Unknown' }}
            </div>
          </div>
        </div>

        <div class="flex items-center space-x-3">
          <div class="rounded-full bg-primary/20 p-2">
            <svg
              class="h-5 w-5 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
          </div>
          <div>
            <div class="text-sm text-base-content/70">Category</div>
            <div class="font-semibold text-base-content">
              {{
                $props.event.category
                  ? $props.event.category
                  : 'Not categorized'
              }}
            </div>
          </div>
        </div>

        <div class="flex items-center space-x-3">
          <div class="rounded-full bg-secondary/20 p-2">
            <svg
              class="h-5 w-5 text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <div>
            <div class="text-sm text-base-content/70">Resource</div>
            <div class="font-semibold text-base-content">
              {{ $props.event.resource ? $props.event.resource : 'None' }}
            </div>
          </div>
        </div>

        <div class="flex items-center space-x-3">
          <div class="rounded-full bg-accent/20 p-2">
            <svg
              class="h-5 w-5 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <div>
            <div class="text-sm text-base-content/70">Repetition</div>
            <div class="font-semibold text-base-content">
              {{
                $props.event.repetition
                  ? repetitionMessage($props.event.repetition)
                  : 'No'
              }}
            </div>
          </div>
        </div>
      </div>

      <div class="mb-6 rounded-lg bg-base-200 p-4">
        <div class="mb-2 text-sm font-medium text-base-content/70">Notes</div>
        <div class="text-sm text-base-content">
          {{ $props.event.note ? $props.event.note : 'No notes' }}
        </div>
      </div>

      <div class="mb-6">
        <div class="mb-2 text-sm font-medium text-base-content/70">
          Notifications
        </div>
        <div
          v-for="notification in $props.event.notify"
          class="mb-1 mr-2 inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
        >
          {{ notifyMessage(notification) }}
        </div>
        <div
          v-if="$props.event.notify.length == 0"
          class="text-sm text-base-content/70"
        >
          No notifications
        </div>
      </div>

      <div class="mb-6 space-y-4">
        <div class="text-sm font-medium text-base-content/70">Guests</div>

        <div class="flex flex-row gap-4">
          <div class="w-full rounded-lg bg-warning/10 p-3">
            <div class="mb-2 text-sm font-medium text-warning">Waiting</div>
            <div class="flex flex-wrap gap-2">
              <template v-if="$props.event.guests.waiting.length > 0">
                <span
                  v-for="guest in $props.event.guests.waiting"
                  :key="guest.username"
                  class="inline-flex items-center rounded-full bg-warning/20 px-3 py-1 text-xs font-medium text-warning"
                >
                  {{ guest.username }}
                </span>
              </template>
              <span v-else class="text-sm text-warning/70">None</span>
            </div>
          </div>

          <div class="w-full rounded-lg bg-success/10 p-3">
            <div class="mb-2 text-sm font-medium text-success">Accepted</div>
            <div class="flex flex-wrap gap-2">
              <template v-if="$props.event.guests.accepted.length > 0">
                <span
                  v-for="guest in $props.event.guests.accepted"
                  :key="guest.username"
                  class="inline-flex items-center rounded-full bg-success/20 px-3 py-1 text-xs font-medium text-success"
                >
                  {{ guest.username }}
                </span>
              </template>
              <span v-else class="text-sm text-success/70">None</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 flex justify-center">
        <CalendarAddToCalendar :event="event" />
      </div>
    </div>
  </div>
</template>
