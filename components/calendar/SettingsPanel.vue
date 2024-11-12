<script setup lang="ts">
import type { CalendarRecurrence } from 'datebook'
import { ICalendar } from 'datebook'
import { saveAs } from 'file-saver'
import ICAL from 'ical.js'

const { $toast } = useNuxtApp()

const { data: events } = useFetch<EventType[]>('/api/events')

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
    count: r.endAfter ? r.endAfter : undefined,
    end: r.endOn ? new Date(r.endOn) : undefined,
    weekdays: calculateWeekDays(e),
    monthdays: calculateMonthDays(e)
  }
}

function exportCal() {
  if (!events.value || events.value.length === 0) {
    alert('No events to export') // toast in the future
    return
  }
  const calendar = new ICalendar({
    title: events.value[0].title,
    description: events.value[0].note || '',
    location: events.value[0].location || '',
    start: new Date(events.value[0].start),
    end: new Date(events.value[0].end),
    recurrence: calculateRecurrenceOUT(events.value[0])
  })
  const eventsWitoutFirst = events.value.slice(1)
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
        notify: [],
        guests: { accepted: [], waiting: [] }
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

    $toast.success('File ICS imported')
  } catch (err) {
    $toast.error('Error parsing ICS file')
  }
}

function calculateRecurrenceIN(event: ICAL.Event): Repetition | null {
  // not supported yet
  console.log("I'm here to not trigger lint, don't mind at me\n" + event)
  return null
}
</script>

<template>
  <div>
    <div class="flex justify-between">
      <span class="flex items-center"> Calendar (Ical) </span>
      <div class="flex justify-evenly gap-4">
        <input
          ref="fileInput"
          type="file"
          accept=".ics"
          class="hidden"
          @change="importCal"
        />
        <button
          class="btn btn-outline btn-neutral"
          @click="$refs.fileInput.click()"
        >
          Import
        </button>
        <button class="btn btn-outline btn-neutral" @click="exportCal()">
          Export
        </button>
      </div>
    </div>
  </div>
</template>
