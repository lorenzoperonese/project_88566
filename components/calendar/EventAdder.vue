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
  <div v-if="modal">
    <h1 class="text-xl font-bold">
      {{ $props.isEventNew ? 'Add event' : 'Modify event' }}
    </h1>
    <form class="mt-4 flex flex-col gap-2" @submit.prevent="">
      <div class="form-control flex flex-row items-center gap-4">
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

      <div class="form-control flex flex-row items-center gap-4">
        <div class="label">
          <label class="label-text">Start</label>
        </div>
        <input
          v-model="_startDate"
          class="input input-bordered w-full"
          type="date"
        />
        <input
          v-model="_startTime"
          class="input input-bordered w-full"
          type="time"
        />
      </div>

      <div class="form-control flex flex-row items-center gap-4">
        <div class="label">
          <label class="label-text">End</label>
        </div>
        <input
          v-model="_endDate"
          class="input input-bordered w-full"
          type="date"
        />
        <input
          v-model="_endTime"
          class="input input-bordered w-full"
          type="time"
        />
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
          placeholder="Add any additional details..."
        ></textarea>
      </div>

      <div class="form-control">
        <div class="label">
          <label class="label-text">Category</label>
        </div>
        <input v-model="_category" class="input input-bordered" type="string" />
      </div>
      <div class="mt-2 flex flex-row justify-center">
        <NuxtLink
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
  <div v-else class="mx-auto mt-4 max-w-7xl rounded-lg bg-base-300 p-8">
    <h1 class="mb-8 text-center text-3xl font-bold">
      {{ $props.isEventNew ? 'Add event' : 'Modify Event' }}
    </h1>

    <form class="grid grid-cols-1 lg:grid-cols-2 lg:gap-8" @submit.prevent="">
      <!-- Left Column -->
      <div class="space-y-2">
        <!-- Title Section -->
        <div
          class="flex items-center gap-4 rounded-xl border border-white p-4 shadow-sm"
        >
          <label class="whitespace-nowrap text-sm font-semibold"
            >Event Title</label
          >
          <input
            v-model="_title"
            type="text"
            placeholder="Enter a descriptive title"
            class="input w-full rounded-lg border-0 px-4 py-3 focus:ring-2 focus:ring-base-300"
            required
          />
        </div>

        <!-- DateTime Section -->
        <div class="space-y-4 rounded-xl border border-white p-4 shadow-sm">
          <div class="items-center gap-4 lg:flex">
            <label class="whitespace-nowrap text-sm font-semibold"
              >Start Date & Time</label
            >
            <div class="flex w-full gap-3">
              <input
                v-model="_startDate"
                type="date"
                class="input flex-1 rounded-lg border-0 px-4 py-3 focus:ring-2 focus:ring-base-300"
              />
              <input
                v-model="_startTime"
                type="time"
                class="input flex-1 rounded-lg border-0 px-4 py-3 focus:ring-2 focus:ring-base-300"
              />
            </div>
          </div>

          <div class="items-center gap-4 lg:flex">
            <label class="whitespace-nowrap text-sm font-semibold"
              >End Date & Time</label
            >
            <div class="flex w-full gap-3">
              <input
                v-model="_endDate"
                type="date"
                class="input flex-1 rounded-lg border-0 px-4 py-3 focus:ring-2 focus:ring-base-300"
              />
              <input
                v-model="_endTime"
                type="time"
                class="input flex-1 rounded-lg border-0 px-4 py-3 focus:ring-2 focus:ring-base-300"
              />
            </div>
          </div>
        </div>

        <!-- Location -->
        <div class="space-y-4 rounded-xl border border-white p-4 shadow-sm">
          <div class="flex items-center gap-4">
            <label class="whitespace-nowrap text-sm font-semibold"
              >Location</label
            >
            <input
              v-model="_location"
              type="string"
              placeholder="Add event location"
              class="input w-full rounded-lg border-0 px-4 py-3 focus:ring-2 focus:ring-base-300"
            />
          </div>
        </div>

        <!-- Guests -->
        <div class="w-full rounded-xl border border-white p-4 shadow-sm">
          <label class="mb-4 block text-sm font-semibold">Guests</label>
          <div class="flex flex-row items-center gap-2">
            <!-- Input con dimensione controllata -->
            <input
              v-model="_guest"
              type="text"
              placeholder="Enter guest name"
              class="input w-0 flex-grow rounded-lg focus:ring-2 focus:ring-base-300"
            />
            <!-- Bottone con dimensioni proporzionate -->
            <button
              class="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              @click="addGuest(_guest)"
            >
              Add
            </button>
          </div>

          <div class="max-h-48 space-y-2 overflow-y-auto">
            <div
              v-for="(g, index) in _guestsAccepted"
              :key="index"
              class="flex items-center justify-between rounded-lg border border-emerald-100 bg-emerald-50 p-3"
            >
              <span class="font-medium text-emerald-700">{{ g.username }}</span>
              <button
                class="text-emerald-600 transition-colors hover:text-red-600"
                @click="_guestsAccepted.splice(_guestsAccepted.indexOf(g), 1)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div
              v-for="(g, index) in _guestsWaiting"
              :key="index"
              class="flex items-center justify-between rounded-lg border border-amber-100 bg-amber-50 p-3"
            >
              <span class="font-medium text-amber-700">{{ g.username }}</span>
              <button
                class="text-amber-600 transition-colors hover:text-red-600"
                @click="_guestsWaiting.splice(_guestsWaiting.indexOf(g), 1)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Repetition -->
        <div class="rounded-xl border border-white p-4 shadow-sm">
          <CalendarRepetition
            :start-day="_startDate"
            :end-day="_endDate"
            :repetition="_repetition"
            @save="addRepetition"
          />
          <pre
            v-if="_repetitionSummary !== ''"
            class="mt-3 rounded-lg text-center text-sm"
            >{{ _repetitionSummary }}</pre
          >
        </div>
      </div>

      <!-- Right Column -->
      <div class="mt-2 space-y-2 lg:mt-0">
        <!-- Category -->
        <div>
          <div
            class="flex items-center gap-4 rounded-xl border border-white p-4 shadow-sm"
          >
            <label class="whitespace-nowrap text-sm font-semibold"
              >Category</label
            >
            <input
              v-model="_category"
              type="string"
              placeholder="Event category"
              class="input w-full rounded-lg border-0 px-4 py-3 focus:ring-2 focus:ring-base-300"
            />
          </div>
        </div>

        <!-- Notes -->
        <div
          class="flex items-center gap-4 rounded-xl border border-white p-4 shadow-sm"
        >
          <label class="mb-2 block text-sm font-semibold">Notes</label>
          <textarea
            v-model="_note"
            rows="4"
            placeholder="Add any additional details..."
            class="textarea h-[13.2rem] w-full rounded-lg border-0 px-4 py-3 focus:ring-2 focus:ring-base-300"
          ></textarea>
        </div>

        <!-- Resource Selection -->
        <div class="rounded-xl border border-white p-4 shadow-sm">
          <label class="mb-2 block text-sm font-semibold">Resource</label>
          <select
            v-model="_resource"
            class="select w-full rounded-lg border-0 px-4 py-3 focus:ring-2 focus:ring-base-300"
          >
            <option value="null">Select a resource</option>
            <option v-for="r in fResourcesList" :value="r.name">
              {{ r.name }}
            </option>
          </select>
        </div>

        <!-- Notifications -->
        <div class="rounded-xl border border-white p-4 shadow-sm">
          <CalendarNotification
            :notifications="_notifications"
            @close="_showNotifications = false"
            @save="addNotifications"
          />
          <pre
            v-if="_notificationsSummary !== ''"
            class="mt-3 rounded-lg text-center text-sm"
            >{{ _notificationsSummary }}</pre
          >
        </div>
      </div>

      <!-- Footer Actions - Full Width -->
      <div class="col-span-1 mt-4 flex justify-end gap-4 lg:col-span-2">
        <NuxtLink
          v-if="$props.isEventNew"
          :to="{ name: 'calendar' }"
          class="rounded-lg border border-gray-200 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
          @click="close"
        >
          Cancel
        </NuxtLink>

        <button
          v-if="!$props.isEventNew"
          class="rounded-lg bg-red-500 px-6 py-3 font-medium text-white hover:bg-red-600"
          @click="deleteEvent()"
        >
          Delete Event
        </button>

        <button
          class="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          @click="saveEvent()"
        >
          {{ $props.isEventNew ? 'Create Event' : 'Save Changes' }}
        </button>
      </div>
    </form>
  </div>
</template>
