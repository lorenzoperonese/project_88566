<script setup lang="ts">
const today = await getToday()
const end = new Date(today.getTime() + 1000 * 60 * 60)

const $props = defineProps<{
  event?: EventType
  modal?: boolean
  isEventNew?: boolean
}>()

const $emits = defineEmits<{
  (e: 'close'): void
}>()

const { $toast } = useNuxtApp()

const { data: _users } = await useFetch<User[]>('/api/users')
const { data: resourceList } = await useFetch<ResourceList[]>(
  '/api/resources-list'
)
const { data: resources } = await useFetch<Resource[]>('/api/resources')
const { data: _notAvailable } =
  await useFetch<NotAvailable[]>('/api/not-available')

const me = await getME()

const _showRepetition = ref(false)
const _showNotifications = ref(false)
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
const _resource = ref<string>('null')
const _repetition = ref<Repetition | null>(null)
const _notifications = ref<Notify[]>([])
const _guestsWaiting = ref<User[]>([])
const _guestsAccepted = ref<User[]>([])
const _guest = ref('')

const fResourcesList = computed(() => {
  if (!resourceList.value) return []

  const startDate = new Date(_startDate.value + ' ' + _startTime.value)
  const endDate = new Date(_endDate.value + ' ' + _endTime.value)

  console.log('resources: ', resources.value)

  return resourceList.value.filter((r) => {
    let tmp =
      isResourceAvailable(resources.value || [], r.name, startDate, endDate) ||
      r.name == _resource.value
    return tmp
  })
})

if ($props.event) {
  _title.value = $props.event.title
  _startDate.value = formatDate($props.event.start)
  _startTime.value = formatTime($props.event.start)
  _endDate.value = formatDate($props.event.end)
  _endTime.value = formatTime($props.event.end)
  _location.value = $props.event.location || null
  _note.value = $props.event.note || null
  _category.value = $props.event.category || 'Not categorized'
  _resource.value = $props.event.resource || 'null'
  if ($props.event.repetition) {
    addRepetition($props.event.repetition)
  }
  if ($props.event.notify) {
    addNotifications($props.event.notify)
  }
  if ($props.event.guests.waiting) {
    _guestsWaiting.value = $props.event.guests.waiting
  }
  if ($props.event.guests.accepted) {
    _guestsAccepted.value = $props.event.guests.accepted
  }
}

function addRepetition(r: Repetition | null) {
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
  if (r.endAfter) {
    _repetitionSummary.value += `, for ${r.endAfter} time`
    _repetitionSummary.value += r.endAfter == 1 ? '' : 's'
  } else if (r.endOn) {
    _repetitionSummary.value += `, until ${formatDate(new Date(r.endOn).getTime())}`
  } else {
    _repetitionSummary.value += `, forever`
  }
}

async function saveEvent() {
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
    resource: _resource.value == 'null' ? null : _resource.value || null,
    repetition: _repetition.value || null,
    notify: _notifications.value,
    guests: {
      accepted: _guestsAccepted.value,
      waiting: _guestsWaiting.value
    } as Guest
  }

  if (e.title.trim() === '') {
    $toast.error('Title is required')
    return
  }
  if (e.start > e.end) {
    $toast.error('Start date must be before end date')
    return
  }
  if (e.category.length == 0) {
    e.category = 'Not categorized'
  }

  if (!$props.isEventNew && $props.event) {
    e.id = $props.event.id
    await $fetch(`/api/events/${$props.event.id}`, {
      method: 'PUT',
      body: JSON.stringify(e)
    })
  } else {
    await $fetch('/api/events', {
      method: 'POST',
      body: JSON.stringify(e)
    })
  }
  $emits('close')
}

function deleteEvent() {
  $fetch(`/api/events/${$props.event?.id}`, {
    method: 'DELETE'
  })
  navigateTo('/calendar')
}

function close() {
  navigateTo('/calendar')
}

function addNotifications(n: Notify[] | null) {
  _notificationsSummary.value = ''
  _showNotifications.value = false

  if (!n) {
    _notifications.value = []
    return
  }

  _notifications.value = n
  const periods = ['minute', 'hour', 'day', 'week']

  n.forEach((notification) => {
    // Gestione periodo base
    let period = periods[notification.period - 1]
    period += notification.advance > 1 ? 's' : ''
    let summary = `${notification.advance} ${period} before`

    // Aggiunta informazioni sulla ripetizione
    if (notification.repeat) {
      if (notification.repeat.untilResponse) {
        summary += `, repeating every ${notification.repeat.interval} `
        let intervalUnit = periods[notification.repeat.intervalUnit - 1]
        if (notification.repeat.interval > 1) intervalUnit += 's'
        summary += `${intervalUnit} until response`
      } else {
        summary += `, repeating ${notification.repeat.count} times every ${notification.repeat.interval} `
        let intervalUnit = periods[notification.repeat.intervalUnit - 1]
        if (notification.repeat.interval > 1) intervalUnit += 's'
        summary += intervalUnit
      }
    }

    _notificationsSummary.value += `${summary}\n`
  })
}

function addGuest(g: string) {
  if (g.length == 0) return
  _guest.value = ''

  if (!_users.value) {
    $toast.error('User not found')
    return
  }

  if (g.trim() === me.username) {
    $toast.error('You cannot invite yourself')
    return
  }

  const user = _users.value.filter((u) => u.username === g)[0]
  if (!user) {
    $toast.error('User not found')
    return
  }

  if (_guestsWaiting.value.filter((u) => u.username === g).length > 0) {
    $toast.error('Username already added')
    return
  }

  const startDate = new Date(_startDate.value + ' ' + _startTime.value)
  const endDate = new Date(_endDate.value + ' ' + _endTime.value)

  if (
    _notAvailable.value &&
    !isUserAvailable(_notAvailable.value, user.id, startDate, endDate)
  ) {
    $toast.error('User is busy')
    return
  }

  _guestsWaiting.value.push(_users.value.filter((u) => u.username === g)[0])
}
</script>

<template>
  <div class="">
    <h1 class="text-xl font-bold">
      {{ $props.event ? 'Modify event' : 'Add event' }}
    </h1>
    <form class="flex flex-col gap-2" @submit.prevent="">
      <div class="form-control">
        <div class="label">
          <label class="label-text">Title</label>
        </div>
        <input
          v-model="_title"
          type="text"
          placeholder="Title"
          class="input input-bordered w-full max-w-md placeholder:text-gray-600"
          required
        />
      </div>

      <div class="form-control">
        <div class="label">
          <label class="label-text">Start</label>
        </div>
        <input v-model="_startDate" class="input input-bordered" type="date" />
        <input v-model="_startTime" class="input input-bordered" type="time" />
      </div>

      <div class="form-control">
        <div class="label">
          <label class="label-text">End</label>
        </div>
        <input v-model="_endDate" class="input input-bordered" type="date" />
        <input v-model="_endTime" class="input input-bordered" type="time" />
      </div>

      <div class="form-control">
        <div class="label">
          <label class="label-text">Location</label>
        </div>
        <input
          v-model="_location"
          class="input input-bordered placeholder:text-gray-600"
          type="string"
          placeholder="Location"
        />
      </div>

      <div class="form-control">
        <div class="label">
          <label class="label-text">Note</label>
        </div>
        <textarea
          v-model="_note"
          class="textarea textarea-bordered w-full placeholder:text-gray-600"
          placeholder="Bio"
        ></textarea>
      </div>

      <div class="form-control">
        <div class="label">
          <label class="label-text">Category</label>
        </div>
        <input v-model="_category" class="input input-bordered" type="string" />
      </div>

      <div class="form-control">
        <div class="label">
          <label class="label-text">Resource</label>
        </div>
        <select v-model="_resource" class="select select-bordered">
          <option value="null">None</option>
          <option v-for="r in fResourcesList" :value="r.name">
            {{ r.name }}
          </option>
        </select>
      </div>

      <div v-if="!modal">
        <div class="flex flex-col gap-2">
          <CalendarRepetition
            :start-day="_startDate"
            :end-day="_endDate"
            :repetition="_repetition"
            @save="addRepetition"
          />
          <pre>{{ _repetitionSummary }}</pre>
        </div>

        <div>
          <CalendarNotification
            :notifications="_notifications"
            @close="_showNotifications = false"
            @save="addNotifications"
          />
          <pre>{{ _notificationsSummary }}</pre>
        </div>

        <div class="flex flex-col gap-2">
          <div class="flex">
            <div class="form-control w-full">
              <div class="label">
                <label class="label-text">Guests</label>
              </div>
              <div class="flex gap-2">
                <input
                  v-model="_guest"
                  type="text"
                  class="input input-sm input-bordered flex-1 md:input-md"
                />
                <div class="flex items-center">
                  <button
                    class="btn btn-info btn-sm md:btn-md"
                    @click="addGuest(_guest)"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-for="(g, index) in _guestsAccepted" :key="index">
            <div class="items flex items-center justify-between">
              <span>{{ g.username }}</span>
              <button
                class="btn btn-outline btn-error btn-sm"
                @click="_guestsAccepted.splice(_guestsAccepted.indexOf(g), 1)"
              >
                Delete
              </button>
            </div>
          </div>

          <div v-for="(g, index) in _guestsWaiting" :key="index">
            <div class="items flex items-center justify-between">
              <span class="text-yellow-400">{{ g.username }}</span>
              <button
                class="btn btn-outline btn-error btn-sm"
                @click="_guestsWaiting.splice(_guestsWaiting.indexOf(g), 1)"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-evenly">
        <NuxtLink
          v-if="$props.isEventNew && !$props.modal"
          :to="{ name: 'calendar' }"
          class="btn btn-neutral w-2/5"
          @click="close"
        >
          Close
        </NuxtLink>

        <button
          v-if="!$props.isEventNew && !$props.modal"
          class="btn btn-error w-2/5"
          @click="deleteEvent()"
        >
          Delete event
        </button>

        <NuxtLink
          v-if="modal"
          :to="{
            path: '/calendar/e/add',
            query: {
              title: _title,
              start_date: _startDate,
              start_time: _startTime,
              end_date: _endDate,
              end_time: _endTime,
              location: _location,
              note: _note,
              category: _category
            }
          }"
          class="btn btn-neutral w-2/5"
        >
          More options
        </NuxtLink>

        <button class="btn btn-success w-2/5" @click="saveEvent()">
          {{ $props.isEventNew ? 'Add event' : 'Save' }}
        </button>
      </div>
    </form>
  </div>
</template>
