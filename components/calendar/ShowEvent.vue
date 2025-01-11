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

function notifyMessage(n: Notify[]) {
  let message = ''
  n.forEach((i) => {
    let period =
      i.period == 1
        ? 'day'
        : i.period == 2
          ? 'week'
          : i.period == 3
            ? 'month'
            : 'year'
    period += i.advance > 1 ? 's' : ''
    message += ` ${i.advance} ${period} before , `
  })
  message = message.slice(0, -2)
  return message
}
</script>

<template>
  <div class="w-full max-w-md">
    <h2 class="text-2xl font-bold text-primary">
      {{ $props.event.title }}
    </h2>

    <div class="my-4 space-y-2">
      <div class="flex flex-col gap-2">
        <div class="grid grid-cols-3 font-medium">
          <span> Start: </span>
          <span class="font-bold">
            {{ formatTime($props.event.start, true) }}
          </span>
          <span class="font-bold">
            {{ formatDate($props.event.start) }}
          </span>
        </div>
        <div class="grid grid-cols-3 font-medium">
          <span> End: </span>
          <span class="font-bold">
            {{ formatTime($props.event.end, true) }}
          </span>
          <span class="font-bold">
            {{ formatDate($props.event.end) }}
          </span>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <div class="grid grid-cols-3">
        <div class="font-medium">Location:</div>
        <div class="font-bold">
          {{ $props.event.location ? $props.event.location : 'unknown' }}
        </div>
      </div>

      <div class="grid grid-cols-3">
        <div class="font-medium">Category:</div>
        <div class="font-bold">
          {{
            $props.event.category ? $props.event.category : 'Not categorized'
          }}
        </div>
      </div>

      <div class="grid grid-cols-3">
        <div class="font-medium">Resource</div>
        <div class="font-bold">
          {{ $props.event.resource ? $props.event.resource : 'None' }}
        </div>
      </div>

      <div class="grid grid-cols-3">
        <div class="font-medium">Repetition</div>
        <div class="font-bold">
          {{
            $props.event.repetition
              ? repetitionMessage($props.event.repetition)
              : 'No'
          }}
        </div>
      </div>
    </div>

    <div class="mt-4 rounded-lg bg-base-200 p-4">
      <div class="mb-2 font-medium text-gray-600">Notes</div>
      <div class="text-sm">
        {{ $props.event.note ? $props.event.note : 'No notes' }}
      </div>
    </div>

    <div class="mt-4">
      <div class="mb-2 font-medium">Notifications</div>
      <div class="badge badge-secondary badge-outline badge-lg">
        {{
          $props.event.notify.length > 0
            ? notifyMessage($props.event.notify)
            : 'No notifications'
        }}
      </div>
    </div>

    <div class="mt-4">
      <div class="mb-2 font-medium">Guests</div>
      <div class="flex flex-col gap-2">
        <div class="flex flex-wrap gap-2">
          <span class="font-medium text-warning">Waiting:</span>
          <div class="flex flex-wrap items-center gap-1">
            <template v-if="$props.event.guests.waiting.length > 0">
              <span
                v-for="guest in $props.event.guests.waiting"
                :key="guest.username"
                class="badge badge-warning badge-sm"
              >
                {{ guest.username }}
              </span>
            </template>
            <span v-else class="text-sm opacity-70">None</span>
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <span class="font-medium text-success">Accepted:</span>
          <div class="flex flex-wrap items-center gap-1">
            <template v-if="$props.event.guests.accepted.length > 0">
              <span
                v-for="guest in $props.event.guests.accepted"
                :key="guest.username"
                class="badge badge-success badge-sm"
              >
                {{ guest.username }}
              </span>
            </template>
            <span v-else class="text-sm opacity-70">None</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card-actions mt-4 justify-end">
      <CalendarAddToCalendar :event="event" />
    </div>
  </div>
</template>
