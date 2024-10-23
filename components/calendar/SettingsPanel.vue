<script setup lang="ts">
import type { CalendarRecurrence } from 'datebook'
import { ICalendar } from 'datebook'
import { saveAs } from 'file-saver'
import ICAL from 'ical.js'

const $props = defineProps<{
  events: EventType[] | null
}>()

const _isOpen = ref(false)

function calculateWeekDays(e: EventType) {
  if (e.repetition === null) return undefined
  if (
    e.repetition.period === 2 &&
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
    e.repetition.period === 3 &&
    e.repetition.repeatOn &&
    !Array.isArray(e.repetition.repeatOn) &&
    e.repetition.repeatOn === 1
  )
    return [new Date(e.start).getDate()]
  return undefined
}

function calculateRecurrence(e: EventType): CalendarRecurrence | undefined {
  const r = e.repetition
  if (!r) return undefined
  return {
    frequency: `${r.period === 1 ? 'DAILY' : r.period === 2 ? 'WEEKLY' : r.period === 3 ? 'MONTHLY' : 'YEARLY'}`,
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
  if (!$props.events || $props.events.length === 0) return
  const calendar = new ICalendar({
    title: $props.events[0].title,
    description: $props.events[0].note || '',
    location: $props.events[0].location || '',
    start: new Date($props.events[0].start),
    end: new Date($props.events[0].end),
    recurrence: calculateRecurrence($props.events[0])
  })
  const eventsWitoutFirst = $props.events.slice(1)
  eventsWitoutFirst.forEach((e) => {
    const event = new ICalendar({
      title: e.title,
      description: e.note || '',
      location: e.location || '',
      start: new Date(e.start),
      end: new Date(e.end),
      recurrence: calculateRecurrence(e)
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
        category: 'Not categorized',
        start: event.startDate.toJSDate().getTime(),
        end: event.endDate.toJSDate().getTime(),
        repetition: null,
        notify: []
      }
      if (e.title.length == 0 || e.start > e.end) {
        alert('Invalid input file')
        return
      }
      console.log(e)
      $fetch('/api/events', {
        method: 'POST',
        body: JSON.stringify(e)
      })
    })
  } catch (err) {
    alert(
      `Errore nel parsing del file ICS: ${err instanceof Error ? err.message : 'Errore sconosciuto'}`
    )
  }
}
</script>

<template>
  <!-- This component will probably be in a navbar -->
  <div class="relative">
    <button
      class="p-2 text-white hover:text-blue-200"
      aria-label="Settings"
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
    </button>
    <div
      v-if="_isOpen"
      class="absolute right-0 z-50 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
    >
      <div
        class="py-1"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="options-menu"
      >
        <input
          ref="fileInput"
          type="file"
          accept=".ics"
          class="hidden"
          @change="importCal"
        />
        <div
          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          role="menuitem"
          @click="$refs.fileInput.click()"
        >
          Import
        </div>

        <div
          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          role="menuitem"
          @click="exportCal()"
        >
          Export
        </div>
      </div>
    </div>
  </div>
</template>
