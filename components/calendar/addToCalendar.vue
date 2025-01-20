<!-- web component, we can make our own later -->
<script setup lang="ts">
const $props = defineProps<{
  event?: EventType
}>()

useHead({
  script: [
    {
      src: '/atc.min.js'
    }
  ],
  link: [
    {
      rel: 'stylesheet',
      href: 'https://cdn.addevent.com/libs/atc/themes/fff-theme-3/theme.css'
    }
  ]
})

function calculateReminder(reminder: Notify[]) {
  const n = reminder
    .map((r) => {
      let period
      switch (r.period) {
        case 1:
          period = 1
          break
        case 2:
          period = 60
          break
        case 3:
          period = 60 * 24
          break
        default:
          period = 60 * 24 * 7
          break
      }
      return period * r.advance
    })
    .sort((a, b) => a - b)
  return n.at(0)
}

function calculateRecurring(e: EventType) {
  const r = e.repetition
  if (!r) return ''
  let result = 'FREQ='
  switch (parseInt(r.period.toString())) {
    case 1:
      result += 'DAILY'
      break
    case 2:
      result += 'WEEKLY'
      break
    case 3:
      result += 'MONTHLY'
      break
    default:
      result += 'YEARLY'
      break
  }
  if (r.endAfter) {
    result += ';COUNT=' + r.endAfter
  } else if (r.endOn) {
    result +=
      ';UNTIL=' +
      new Date(r.endOn).toISOString().replace(/[-:]/g, '').slice(0, 15) +
      ';'
  }
  if (r.period == 2 && r.repeatOn && Array.isArray(r.repeatOn)) {
    result += ';BYDAY=' + r.repeatOn.map((e) => shortDays[e]).join(',')
  } else if (r.period == 3) {
    result +=
      r.repeatOn == 1
        ? ';BYMONTHDAY=' + new Date(e.start).getDate()
        : ';BYDAY=' +
          Math.ceil(new Date(e.start).getDate() / 7) +
          shortDays[new Date(e.start).getDay()]
  }
  return result
}
</script>
<template>
  <div
    v-if="$props.event"
    class="addeventatc"
    data-styling="none"
    data-intel="false"
  >
    <div class="date">
      <span class="mon">{{
        shortMonths[new Date($props.event.start).getMonth()]
      }}</span>
      <span class="day">{{ new Date($props.event.start).getDate() }}</span>
      <div class="bdr1"></div>
      <div class="bdr2"></div>
    </div>
    <div class="desc">
      <p>
        <strong class="hed">{{ $props.event.title }}</strong>
        <span class="des"
          >{{
            $props.event.location
              ? `Location: ${$props.event.location} `
              : `Location: unknown`
          }}
          <br />When: {{ formatTime($props.event.start, true) }} -
          {{ formatTime($props.event.end, true) }}</span
        >
      </p>
    </div>
    <span class="start">{{
      new Date($props.event.start).toLocaleString('us-US')
    }}</span>
    <span class="end">{{
      new Date($props.event.end).toLocaleString('us-US')
    }}</span>
    <span class="timezone"
      >Europe/Rome
      <!-- TODO -->
    </span>
    <span class="title">{{ $props.event.title }}</span>
    <span v-if="$props.event.note" class="description">{{
      $props.event.note
    }}</span>
    <span v-if="$props.event.location" class="location">{{
      $props.event.location
    }}</span>
    <!-- support for just one reminder -->
    <span v-if="$props.event.notify" class="alarm_reminder">{{
      calculateReminder($props.event.notify)
    }}</span>
    <span v-if="$props.event.repetition" class="recurring">{{
      calculateRecurring($props.event)
    }}</span>
  </div>
</template>
