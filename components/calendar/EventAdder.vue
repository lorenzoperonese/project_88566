<script setup lang="ts">
const today = await getToday()
const end = new Date(today.getTime() + 1000 * 60 * 60)

const $props = defineProps<{
  event?: EventType
}>()

const _showRepetition = ref(false)
const _errorMessage = ref('')
const _summaryMessage = ref('')

const _title = ref('')
const _startDate = ref<string>(formatDate(today.getTime()))
const _startTime = ref<string>(formatTime(today.getTime()))
const _endDate = ref<string>(formatDate(end.getTime()))
const _endTime = ref<string>(formatTime(end.getTime()))
const _location = ref('')
const _note = ref('')
const _category = ref('Not categorized')
const _repetition = ref<Repetition | undefined>(undefined)

if ($props.event) {
  _title.value = $props.event.title
  _startDate.value = formatDate($props.event.start)
  _startTime.value = formatTime($props.event.start)
  _endDate.value = formatDate($props.event.end)
  _endTime.value = formatTime($props.event.end)
  _location.value = $props.event.location || ''
  _note.value = $props.event.note || ''
  _category.value = $props.event.category || 'Not categorized'
  if ($props.event.repetition) {
    _repetition.value = $props.event.repetition
    addRepetition(_repetition.value)
  }
}

function addRepetition(r: Repetition) {
  _errorMessage.value = ''
  _showRepetition.value = false
  _repetition.value = r
  console.log(r)
  //_summaryMessage.value =
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
    _summaryMessage.value = `Every ${r.every} ${tmp}`
  } else {
    switch (parseInt(r.period.toString())) {
      case 1:
        _summaryMessage.value = 'Daily'
        break
      case 2:
        _summaryMessage.value = 'Weekly'
        break
      case 3:
        _summaryMessage.value = 'Monthly'
        break
      default:
        _summaryMessage.value = 'Yearly'
    }
  }
  if (r.period == 2 && r.repeatOn && Array.isArray(r.repeatOn)) {
    _summaryMessage.value +=
      ', on ' + r.repeatOn.map((e: number) => days[e]).join(', ')
  } else if (r.period == 3) {
    _summaryMessage.value +=
      r.repeatOn == 1 ? ', on the same date' : `, on the same weekday`
  }
  //_summaryMessage.value;
  if (r.end === undefined) {
    _summaryMessage.value += ', forever'
  } else if (r.end < new Date().getTime() / 2) {
    _summaryMessage.value += `, for ${r.end} time`
    _summaryMessage.value += r.end == 1 ? '' : 's'
  } else {
    _summaryMessage.value += `, until ${formatDate(new Date(r.end).getTime())}`
  }
}

function saveEvent() {
  _errorMessage.value = ''
  const startDate = new Date(
    _startDate.value + ' ' + _startTime.value
  ).getTime()
  const endDate = new Date(_endDate.value + ' ' + _endTime.value).getTime()

  const ifEmtpyNull = (a: string) => {
    if (a.length == 0) {
      return undefined
    }
    return a
  }

  const e: EventType = {
    id: '0',
    title: _title.value,
    start: startDate,
    end: endDate,
    location: ifEmtpyNull(_location.value),
    note: ifEmtpyNull(_note.value),
    category: ifEmtpyNull(_category.value),
    repetition: _repetition.value
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
</script>

<template>
  <div class="w-1/5">
    <h1 class="text-xl font-bold">
      {{ $props.event ? 'Modify event' : 'Add event' }}
    </h1>
    <form class="flex flex-col gap-2" @submit.prevent="">
      <div>
        <label>Title:</label>
        <input v-model="_title" class="rounded border p-2" />
      </div>

      <div>
        <label>Start:</label>
        <input v-model="_startDate" class="rounded border p-2" type="date" />
        <input v-model="_startTime" class="rounded border p-2" type="time" />
      </div>

      <div>
        <label>End:</label>
        <input v-model="_endDate" class="rounded border p-2" type="date" />
        <input v-model="_endTime" class="rounded border p-2" type="time" />
      </div>

      <div>
        <label>Location:</label>
        <input v-model="_location" class="rounded border p-2" type="string" />
      </div>

      <div>
        <label>Note:</label>
        <textarea v-model="_note" class="rounded border p-2"> </textarea>
      </div>

      <div>
        <label>Category:</label>
        <input v-model="_category" class="rounded border p-2" type="string" />
      </div>

      <div>
        <button
          class="rounded border bg-orange-300 p-2 hover:bg-orange-500"
          @click="_showRepetition = true"
        >
          Repetition
        </button>
        <p>{{ _summaryMessage }}</p>
        <CalendarRepetition
          v-show="_showRepetition"
          :day="_startDate"
          :repetition="_repetition"
          @close="_showRepetition = false"
          @save="addRepetition"
        />
        <CalendarNotification :start="_startTime" />
      </div>

      <div class="flex">
        <NuxtLink class="w-full" to="/calendar">
          <div
            class="w-full rounded border bg-red-300 p-2 text-center hover:bg-red-500"
          >
            Cancel
          </div>
        </NuxtLink>

        <button
          v-if="$props.event"
          class="w-full rounded border bg-orange-300 p-2 hover:bg-orange-500"
          @click="deleteEvent()"
        >
          Delete event
        </button>

        <button
          class="w-full rounded border bg-blue-300 p-2 hover:bg-blue-500"
          @click="saveEvent()"
        >
          {{ $props.event ? 'Save' : 'Add event' }}
        </button>
      </div>
    </form>
    <p class="text-red-500">{{ _errorMessage }}</p>
  </div>
</template>
