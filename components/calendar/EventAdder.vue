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

const { data: _users } = useFetch<User[]>('/api/users')
const { data: resourceList } = useFetch<ResourceList[]>('/api/resources-list')
const { data: resources } = useFetch<Resource[]>('/api/resources')
const { data: _notAvailable } = useFetch<NotAvailable[]>('/api/not-available')

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
const _allday = ref(false)

const fResourcesList = computed(() => {
  if (!resourceList.value) return []

  const startDate = new Date(_startDate.value + ' ' + _startTime.value)
  const endDate = new Date(_endDate.value + ' ' + _endTime.value)

  return resourceList.value.filter((r) => {
    const tmp =
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
  _allday.value =
    $props.event.start % (1000 * 60 * 60 * 24) == 1000 * 60 * 60 * 23 &&
    $props.event.end % (1000 * 60 * 60 * 24) == 1000 * 60 * 60 * 23 - 1
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

  const e = {
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
      accepted: _guestsAccepted.value.map((u) => u.username),
      waiting: _guestsWaiting.value.map((u) => u.username)
    }
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
  if (_allday.value) {
    // crea le date senza l'ora, da mezzanotte alle 23,59
    e.start = new Date(_startDate.value).getTime() - 1000 * 60 * 60
    e.end = new Date(_endDate.value).getTime() + 1000 * 60 * 60 * 23 - 1
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
  <div class="mx-auto w-full max-w-4xl p-4">
    <!-- Card Wrapper -->
    <div :class="!modal ? 'card bg-base-300 p-6 shadow-lg' : ''">
      <!-- Header -->
      <h1
        class="font-bold"
        :class="{ 'text center mb-2 text-4xl': !modal, 'text-xl': modal }"
      >
        {{ $props.isEventNew ? 'Add event' : 'Modify event' }}
      </h1>

      <form @submit.prevent="" class="space-y-4">
        <!-- Title Section -->
        <div class="space-y-2">
          <Label for="title" class="label-text">Title</Label>
          <div class="relative">
            <input
              v-model="_title"
              id="title"
              type="text"
              class="input input-bordered w-full rounded-lg px-4 py-2 placeholder:text-gray-600"
              placeholder="Event title"
              required
            />
          </div>
        </div>

        <!-- Date and Time Section -->
        <div
          class="grid gap-6"
          :class="{
            'grid-cols-1': modal && !_allday,
            'md:grid-cols-2': !modal || _allday
          }"
        >
          <!-- Start Date/Time -->
          <div class="space-y-2">
            <Label class="label-text">Start</Label>
            <div class="grid grid-cols-2 gap-3">
              <input
                v-model="_startDate"
                type="date"
                class="input input-bordered rounded-lg px-4 py-2 text-center"
                :class="{ 'col-span-2': _allday }"
              />
              <input
                v-if="!_allday"
                v-model="_startTime"
                type="time"
                class="input input-bordered rounded-lg px-4 py-2 text-center"
              />
            </div>
          </div>

          <!-- End Date/Time -->
          <div class="space-y-2">
            <Label class="label-text">End</Label>
            <div class="grid grid-cols-2 gap-3">
              <input
                v-model="_endDate"
                type="date"
                class="input input-bordered rounded-lg px-4 py-2 text-center"
                :class="{ 'col-span-2': _allday }"
              />
              <input
                v-if="!_allday"
                v-model="_endTime"
                type="time"
                class="input input-bordered rounded-lg px-4 py-2 text-center"
              />
            </div>
          </div>
        </div>

        <!-- All Day Section -->
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <input v-model="_allday" type="checkbox" class="checkbox" />
            <!-- attiva la checkbox al click sul testo -->
            <span @click="_allday = !_allday" class="cursor-pointer"
              >Event lasts all day</span
            >
          </div>
        </div>

        <!-- Location and Category Section -->
        <div
          class="grid gap-6 md:grid-cols-2"
          :class="{ 'md:grid-cols-3': !modal }"
        >
          <div class="space-y-2">
            <Label for="location" class="label-text">Location</Label>
            <input
              v-model="_location"
              id="location"
              type="text"
              class="input input-bordered w-full rounded-lg px-4 py-2 placeholder:text-gray-600"
              placeholder="Add location"
            />
          </div>

          <div class="space-y-2">
            <Label for="category" class="label-text">Category</Label>
            <input
              v-model="_category"
              id="category"
              type="text"
              class="input input-bordered w-full rounded-lg px-4 py-2 placeholder:text-gray-600"
              placeholder="Add category"
            />
          </div>
          <!-- Resource Section -->
          <div class="space-y-2" v-if="!modal">
            <Label for="resource" class="label-text">Resource</Label>
            <select
              v-model="_resource"
              id="resource"
              class="input input-bordered w-full rounded-lg px-4 py-2"
              :class="{ 'text-gray-600': _resource == 'null' }"
            >
              <option value="null">None</option>
              <option v-for="r in fResourcesList" :key="r.name" :value="r.name">
                {{ r.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Note Section -->
        <div class="space-y-2">
          <Label for="note" class="label-text">Note</Label>
          <textarea
            v-model="_note"
            id="note"
            class="textarea textarea-bordered min-h-[80px] w-full rounded-lg px-4 py-2 placeholder:text-gray-600"
            placeholder="Add description or notes"
          ></textarea>
        </div>

        <!-- Additional Options (Only shown in full page) -->
        <div v-if="!modal" class="space-y-6">
          <div class="grid md:grid-cols-2">
            <!-- Repetition Component -->
            <div class="rounded-lg p-2">
              <CalendarRepetition
                :start-day="_startDate"
                :end-day="_endDate"
                :repetition="_repetition"
                @save="addRepetition"
              />
              <pre class="mt-1 text-wrap text-center text-sm">{{
                _repetitionSummary
              }}</pre>
            </div>

            <!-- Notifications Component -->
            <div class="rounded-lg p-2">
              <CalendarNotification
                :notifications="_notifications"
                @close="_showNotifications = false"
                @save="addNotifications"
              />
              <pre class="mt-1 text-wrap text-center text-sm">{{
                _notificationsSummary
              }}</pre>
            </div>
          </div>

          <!-- Guests Section -->
          <div class="space-y-4">
            <div class="space-y-2">
              <Label class="label-text">Guests</Label>
              <div class="flex gap-2">
                <input
                  v-model="_guest"
                  type="text"
                  class="input input-bordered w-full flex-wrap rounded-lg placeholder:text-gray-600"
                  placeholder="Add guest username"
                />
                <button class="btn btn-neutral" @click="addGuest(_guest)">
                  Add
                </button>
              </div>
            </div>

            <!-- Guest Lists -->
            <div class="grid grid-cols-1 space-y-2 md:grid-cols-2 md:space-y-0">
              <ul class="flex flex-wrap justify-center gap-1">
                <li
                  v-if="_guestsWaiting.length == 0"
                  class="text-center text-warning"
                >
                  No guests waiting
                </li>
                <li
                  v-for="g in _guestsWaiting"
                  :key="g.id"
                  class="inline-flex items-center gap-1 rounded-full bg-warning/20 px-3 py-1 font-medium text-warning"
                >
                  <span>{{ g.username }}</span>
                  <button
                    @click="
                      _guestsWaiting = _guestsWaiting.filter(
                        (u) => u.id !== g.id
                      )
                    "
                    class="bg-transparent text-red-500 hover:text-red-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L10 8.586 7.707 6.293a1 1 0 00-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 001.414 1.414L10 11.414l2.293 2.293a1 1 0 001.414-1.414L11.414 10l2.293-2.293z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </li>
              </ul>

              <ul class="flex flex-wrap justify-center gap-1">
                <li
                  v-if="_guestsAccepted.length == 0"
                  class="text-center text-success"
                >
                  No guests accepted
                </li>
                <li
                  v-for="g in _guestsAccepted"
                  :key="g.id"
                  class="inline-flex items-center gap-1 rounded-full bg-success/20 px-3 py-1 font-medium text-success"
                >
                  <span>{{ g.username }}</span>
                  <button
                    @click="
                      _guestsAccepted = _guestsAccepted.filter(
                        (u) => u.id !== g.id
                      )
                    "
                    class="bg-transparent text-red-500 hover:text-red-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L10 8.586 7.707 6.293a1 1 0 00-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 001.414 1.414L10 11.414l2.293 2.293a1 1 0 001.414-1.414L11.414 10l2.293-2.293z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-4 pt-2">
          <NuxtLink
            v-if="$props.isEventNew && !$props.modal"
            :to="{ name: 'calendar' }"
            class="btn btn-neutral"
          >
            Cancel
          </NuxtLink>

          <button
            v-if="!$props.isEventNew && !$props.modal"
            class="btn btn-error"
            @click="deleteEvent()"
          >
            Delete
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
            class="btn btn-neutral"
          >
            More options
          </NuxtLink>

          <button class="btn btn-success" @click="saveEvent()">
            {{ $props.isEventNew ? 'Create event' : 'Save changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
