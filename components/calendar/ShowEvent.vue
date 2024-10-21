<script setup lang="ts">
const $props = defineProps<{
  event: EventType
}>()

function repetitionMessage (r: Repetition) {
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
    message +=
      ', on ' + r.repeatOn.map((e: number) => days[e]).join(', ')
  } else if (r.period == 3) {
    message +=
      r.repeatOn == 1 ? ', on the same date' : `, on the same weekday`
  }
  if (r.end === null) {
    message += ', forever'
  } else if (r.end < new Date().getTime() / 2) {
    message += `, for ${r.end} time`
    message += r.end == 1 ? '' : 's'
  } else {
    message += `, until ${formatDate(new Date(r.end).getTime())}`
  }
  return message
}

function notifyMessage (n: Notify[]) {
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
    message +=
      ` ${i.advance} ${period} before at ${formatTime(i.hour, true)}` + '\n'
  })
  return message
}

</script>

<template>
  <div>
    <div>
      <div>
        <div>Title: {{ $props.event.title.toUpperCase() }}</div>
        <div>When: {{ formatTime($props.event.start, true) }} - {{ formatTime($props.event.end, true) }}</div>
        <div>Location: {{ $props.event.location ? $props.event.location : 'unknown' }}</div>
        <div>Notes: {{ $props.event.note ? $props.event.note : 'No notes' }}</div>
        <div>Repetition: {{ $props.event.repetition ? repetitionMessage($props.event.repetition) : 'No' }}</div>
        <div>Notify: {{ $props.event.notify ? notifyMessage($props.event.notify) : 'No' }}</div>
      </div>
    </div>
    <CalendarAddToCalendar :event="event"/>
  </div>
</template>