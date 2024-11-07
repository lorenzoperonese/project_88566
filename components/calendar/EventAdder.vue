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
const _guests = ref<User[]>([])
const _guest = ref('')

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
  if ($props.event.guests.waiting) {
    _guests.value = $props.event.guests.waiting
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
  if (r.endAfter) {
    _repetitionSummary.value += `, for ${r.endAfter} time`
    _repetitionSummary.value += r.endAfter == 1 ? '' : 's'
  }
  else if (r.endOn) {
    _repetitionSummary.value += `, until ${formatDate(new Date(r.endOn).getTime())}`
  }
  else {
    _repetitionSummary.value += `, forever`
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
    notify: _notifications.value,
    guests: { accepted: [], waiting: _guests.value } as Guest
  }

  if (e.title.length == 0 || e.start > e.end) {
    _errorMessage.value = 'Invalid input'
    return
  }

  if (!$props.isEventNew && $props.event) {
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
  $emits('close')
}

function deleteEvent() {
  const router = useRouter()

  $fetch(`/api/events/${$props.event?.id}`, {
    method: 'DELETE'
  })

  router.push({ name: 'calendar' })
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

function addGuest(g: string) {
  if (g.length == 0) return
  _guest.value = ''
  if(!_users.value) {
    $toast.error('No users found')
    return
  }
  const user = _users.value.filter(u => u.username === g)[0]
  if(!user)
    $toast.error('User not found')
  else
    _guests.value.push(_users.value.filter(u => u.username === g)[0])
  return
}

</script>

<template>
  <div class="">
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
        <input v-model="_startDate" class="input input-bordered" type="date" />
        <input v-model="_startTime" class="input input-bordered" type="time" />
      </div>

      <div>
        <label>End:</label>
        <input v-model="_endDate" class="input input-bordered" type="date" />
        <input v-model="_endTime" class="input input-bordered" type="time" />
      </div>

      <div>
        <label>Location:</label>
        <input v-model="_location" class="input input-bordered" type="string" />
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
        <input v-model="_category" class="input input-bordered" type="string" />
      </div>

      <div v-if="!modal">
        <div>
          <CalendarRepetition
            :day="_startDate"
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

        <div>
          Guests:
          <div>
            <input
              v-model="_guest"
              type="text"
              class="input input-bordered w-full max-w-xs"
            />
          </div>
            <div @click.prevent="">
            <button
              class="btn btn-circle btn-info btn-sm"
              @click="addGuest(_guest)"
            >
              <svg
                class="h-5 w-5 opacity-70"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
            </div>
        </div>
            <div v-for="(g, index) in _guests" :key="index">
              <div class="flex items">
                <span>{{ g.username }}</span>
                <button
                  class="btn btn-circle btn-error btn-sm"
                  @click="_guests.splice(_guests.indexOf(g), 1)"
                >
                  <svg
                    class="h-5 w-5 opacity-70"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
            </div>
          </div>
        </div>

      <div class="flex justify-evenly">
        <NuxtLink
          :to="{ name: 'calendar' }"
          v-if="$props.isEventNew && !$props.modal"
          class="btn btn-neutral w-2/5"
          @click="deleteEvent()"
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
          v-if="modal"
        >
          More options
        </NuxtLink>

        <button class="btn btn-success w-2/5" @click="saveEvent()">
          {{ $props.isEventNew ? 'Add event' : 'Save' }}
        </button>
      </div>
    </form>
    <p class="text-red-500">{{ _errorMessage }}</p>
  </div>
</template>
