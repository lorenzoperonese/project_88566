<script setup lang="ts">
const today = await getToday()
const end = new Date(today.getTime() + 1000 * 60 * 60)

const $props = defineProps<{
  event?: EventType
}>()

const _showRepetition = ref(false)
const _showNotifications = ref(false)
const _errorMessage = ref('')
const _repetitionSummary = ref('')
const _notificationsSummary = ref('')

const _title = ref('')
const _startDate = ref<string>(formatDate(today.getTime()))
const _startTime = ref<string>(formatTime(today.getTime()))
const _endDate = ref<string>(formatDate(end.getTime()))
const _endTime = ref<string>(formatTime(end.getTime()))
const _location = ref<string | null>(null) // string for now, will be changed to Location
const _note = ref<string | null>(null)
const _category = ref<string>('Not categorized')
const _repetition = ref<Repetition | null>(null)
const _notifications = ref<Notify[]>([])

if ($props.event) {
  _title.value = $props.event.title
  _startDate.value = formatDate($props.event.start)
  _startTime.value = formatTime($props.event.start)
  _endDate.value = formatDate($props.event.end)
  _endTime.value = formatTime($props.event.end)
  _location.value = $props.event.location || null
  _note.value = $props.event.note || null
  _category.value = $props.event.category || 'Not categorized'
  if ($props.event.repetition) {
    addRepetition($props.event.repetition)
  }
  if ($props.event.notify) {
    addNotifications($props.event.notify)
  }
}

function addRepetition(r: Repetition | null) {
  _errorMessage.value = ''
  _showRepetition.value = false
  if (!r) {
    _repetition.value = null
    _repetitionSummary.value = ''
    return
  }
  _repetition.value = r
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
    _repetitionSummary.value = `Every ${r.every} ${tmp}`
  } else {
    switch (parseInt(r.period.toString())) {
      case 1:
        _repetitionSummary.value = 'Daily'
        break
      case 2:
        _repetitionSummary.value = 'Weekly'
        break
      case 3:
        _repetitionSummary.value = 'Monthly'
        break
      default:
        _repetitionSummary.value = 'Yearly'
    }
  }
  if (r.period == 2 && r.repeatOn && Array.isArray(r.repeatOn)) {
    _repetitionSummary.value +=
      ', on ' + r.repeatOn.map((e: number) => days[e]).join(', ')
  } else if (r.period == 3) {
    _repetitionSummary.value +=
      r.repeatOn == 1 ? ', on the same date' : `, on the same weekday`
  }
  if (r.end === null) {
    _repetitionSummary.value += ', forever'
  } else if (r.end < new Date().getTime() / 2) {
    _repetitionSummary.value += `, for ${r.end} time`
    _repetitionSummary.value += r.end == 1 ? '' : 's'
  } else {
    _repetitionSummary.value += `, until ${formatDate(new Date(r.end).getTime())}`
  }
}

function saveEvent() {
  _errorMessage.value = ''
  const startDate = new Date(
    _startDate.value + ' ' + _startTime.value
  ).getTime()
  const endDate = new Date(_endDate.value + ' ' + _endTime.value).getTime()

  const e: EventType = {
    id: '0',
    title: _title.value,
    start: startDate,
    end: endDate,
    location: _location.value || null,
    note: _note.value || null,
    category: _category.value || 'Not categorized',
    repetition: _repetition.value || null,
    notify: _notifications.value || null
  }

  if (e.title.length == 0 || e.start > e.end) {
    _errorMessage.value = 'Invalid input'
    return
  }
  if ($props.event) {
    e.id = $props.event.id
    $fetch(`/api/events/${$props.event.id}`, {
      method: 'PUT',
      body: JSON.stringify(e)
    })
  } else {
    $fetch('/api/events', {
      method: 'POST',
      body: JSON.stringify(e)
    })
  }
  navigateTo('/calendar')
}

function deleteEvent() {
  $fetch(`/api/events/${$props.event?.id}`, {
    method: 'DELETE'
  })
  navigateTo('/calendar')
}

function addNotifications(n: Notify[] | null) {
  _errorMessage.value = ''
  _notificationsSummary.value = ''
  _showNotifications.value = false
  if (!n) {
    _notifications.value = []
    _notificationsSummary.value = ''
    return
  }
  _notifications.value = n
  n.forEach((i) => {
    let period =
      i.period == 1
        ? 'minute'
        : i.period == 2
          ? 'hour'
          : i.period == 3
            ? 'day'
            : 'month'
    period += i.advance > 1 ? 's' : ''
    _notificationsSummary.value += ` ${i.advance} ${period} before\n`
  })
}
</script>

<template>
  <div class="card w-1/2 bg-base-100 shadow-xl">
    <div class="card-body w-full">
      <div class="card-actions justify-end">
        <NuxtLink class="btn btn-square btn-sm" to="/calendar">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </NuxtLink>
      </div>
      <h1 class="text-xl font-bold">
        {{ $props.event ? 'Modify event' : 'Add event' }}
      </h1>
      <form class="flex flex-col gap-2" @submit.prevent="">
        <div>
          <label>Title:</label>
          <input
            v-model="_title"
            type="text"
            placeholder="Type here"
            class="input input-bordered w-full max-w-xs"
            required
          />
        </div>

        <div>
          <label>Start:</label>
          <input
            v-model="_startDate"
            class="input input-bordered"
            type="date"
          />
          <input
            v-model="_startTime"
            class="input input-bordered"
            type="time"
          />
        </div>

        <div>
          <label>End:</label>
          <input v-model="_endDate" class="input input-bordered" type="date" />
          <input v-model="_endTime" class="input input-bordered" type="time" />
        </div>

        <div>
          <label>Location:</label>
          <input
            v-model="_location"
            class="input input-bordered"
            type="string"
          />
        </div>

        <div>
          <label>Note:</label>
          <textarea
            v-model="_note"
            class="textarea textarea-bordered w-full"
            placeholder="Bio"
          ></textarea>
        </div>

        <div>
          <label>Category:</label>
          <input
            v-model="_category"
            class="input input-bordered"
            type="string"
          />
        </div>

        <div>
          <CalendarRepetition
            :day="_startDate"
            :repetition="_repetition"
            @save="addRepetition"
          />
        </div>

        <div>
          <pre>{{ _notificationsSummary }}</pre>
          <CalendarNotification
            :end="new Date('1900-01-01 ' + _startTime).getTime()"
            :notifications="_notifications"
            @close="_showNotifications = false"
            @save="addNotifications"
          />
        </div>

        <div class="flex justify-evenly">
          <button
            v-if="$props.event"
            class="btn btn-error w-2/5"
            @click="deleteEvent()"
          >
            Delete event
          </button>

          <button class="btn btn-success w-2/5" @click="saveEvent()">
            {{ $props.event ? 'Save' : 'Add event' }}
          </button>
        </div>
      </form>
      <p class="text-red-500">{{ _errorMessage }}</p>
    </div>
  </div>
</template>
