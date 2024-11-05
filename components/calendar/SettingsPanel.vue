<script setup lang="ts">
import type { CalendarRecurrence } from 'datebook'
import { ICalendar } from 'datebook'
import { saveAs } from 'file-saver'
import ICAL from 'ical.js'

const { $toast } = useNuxtApp()

const $props = defineProps<{
  events: EventType[] | null
}>()

const _isOpen = ref(false)

function calculateWeekDays(e: EventType) {
  if (e.repetition === null) return undefined
  if (
    parseInt(e.repetition.period.toString()) === 2 &&
    e.repetition.repeatOn &&
    Array.isArray(e.repetition.repeatOn)
  )
    return e.repetition.repeatOn.map((e) => shortDays[e])
  else if (
    e.repetition.period === 3 &&
    e.repetition.repeatOn &&
    !Array.isArray(e.repetition.repeatOn) &&
    e.repetition.repeatOn === 2
  )
    return [
      Math.ceil(new Date(e.start).getDate() / 7) +
        shortDays[new Date(e.start).getDay()]
    ]
  return undefined
}

function calculateMonthDays(e: EventType) {
  if (e.repetition === null) return undefined
  if (
    parseInt(e.repetition.period.toString()) === 3 &&
    e.repetition.repeatOn &&
    !Array.isArray(e.repetition.repeatOn) &&
    e.repetition.repeatOn === 1
  )
    return [new Date(e.start).getDate()]
  return undefined
}

function calculateRecurrenceOUT(e: EventType): CalendarRecurrence | undefined {
  const r = e.repetition
  if (!r) return undefined
  return {
    frequency: `${parseInt(r.period.toString()) === 1 ? 'DAILY' : parseInt(r.period.toString()) === 2 ? 'WEEKLY' : parseInt(r.period.toString()) === 3 ? 'MONTHLY' : 'YEARLY'}`,
    interval: r.every,
    count:
      r.end !== null && r.end < new Date('1900-01-01 00:00 AM').getTime()
        ? r.end
        : undefined,
    end:
      r.end !== null && r.end >= new Date('1900-01-01 00:00 AM').getTime()
        ? new Date(r.end)
        : undefined,
    weekdays: calculateWeekDays(e),
    monthdays: calculateMonthDays(e)
  }
}

function exportCal() {
  if (!$props.events || $props.events.length === 0) {
    alert('No events to export') // toast in the future
    return
  }
  const calendar = new ICalendar({
    title: $props.events[0].title,
    description: $props.events[0].note || '',
    location: $props.events[0].location || '',
    start: new Date($props.events[0].start),
    end: new Date($props.events[0].end),
    recurrence: calculateRecurrenceOUT($props.events[0])
  })
  const eventsWitoutFirst = $props.events.slice(1)
  eventsWitoutFirst.forEach((e) => {
    const event = new ICalendar({
      title: e.title,
      description: e.note || '',
      location: e.location || '',
      start: new Date(e.start),
      end: new Date(e.end),
      recurrence: calculateRecurrenceOUT(e)
    })
    calendar.addEvent(event)
  })
  const blob = new Blob([calendar.render()], {
    type: 'text/calendar;charset=utf-8'
  })
  saveAs(blob, 'calendar.ics')
}

const importCal = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    if (file.name.endsWith('.ics')) {
      readFile(file)
    } else {
      alert('Per favore seleziona un file .ics valido')
    }
  }
}

const readFile = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e: ProgressEvent<FileReader>) => {
    try {
      const icsData = e.target?.result
      if (typeof icsData === 'string') parseICSContent(icsData)
    } catch (err) {
      alert(
        `Errore nella lettura del file: ${err instanceof Error ? err.message : 'Errore sconosciuto'}`
      )
    }
  }
  reader.onerror = () => {
    alert('Errore nella lettura del file')
  }
  reader.readAsText(file)
}

const parseICSContent = (icsData: string) => {
  try {
    const jcalData = ICAL.parse(icsData)
    const vcalendar = new ICAL.Component(jcalData)
    const vevents = vcalendar.getAllSubcomponents('vevent')

    vevents.forEach((vevent) => {
      const event = new ICAL.Event(vevent)
      const e: EventType = {
        id: '0',
        title: event.summary,
        note: event.description,
        location: event.location,
        category: 'Imported event',
        start: event.startDate.toJSDate().getTime(),
        end: event.endDate.toJSDate().getTime(),
        repetition: calculateRecurrenceIN(event),
        notify: []
      }
      if (e.title.length == 0 || e.start > e.end) {
        alert('Invalid input file')
        return
      }
      $fetch('/api/events', {
        method: 'POST',
        body: JSON.stringify(e)
      })
    })

    $toast.success('File CIS imported')
  } catch (err) {
    $toast.error('Error parsing CIS file')
  }
}

function calculateRecurrenceIN(event: ICAL.Event): Repetition | null {
  // not supported yet
  console.log("I'm here to not trigger lint, don't mind at me\n" + event)
  return null
}
</script>

<template>
  <div class="dropdown dropdown-end dropdown-bottom">
    <div
      tabindex="0"
      role="button"
      class="btn m-1 border-none bg-base-300 hover:bg-base-200"
      @click="_isOpen = !_isOpen"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-settings"
      >
        <circle cx="12" cy="12" r="3"></circle>
        <path
          d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
        ></path>
      </svg>
    </div>
    <ul
      tabindex="0"
      class="menu dropdown-content z-[1] w-52 rounded-box bg-base-300 p-2 shadow"
    >
      <input
        ref="fileInput"
        type="file"
        accept=".ics"
        class="hidden"
        @change="importCal"
      />
      <li><a @click="$refs.fileInput.click()">Import</a></li>
      <li><a @click="exportCal()">Export</a></li>
    </ul>
  </div>
</template>
