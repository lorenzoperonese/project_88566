<script setup lang="ts">
const $emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', n: Notify[] | null): void
}>()

const $props = defineProps<{
  end: number
  notifications: Notify[]
}>()

interface NotifyWithHour {
  advance: number
  period: number
  hour: string
}

const _notifications = ref<NotifyWithHour[]>(
  $props.notifications.map((n) => ({ ...n, hour: formatTime(n.hour) }))
)

const newNotification = ref<NotifyWithHour>({
  advance: 1,
  period: 1,
  hour: formatTime($props.end)
})

const repetitions = [
  { value: 1, name: 'Day' },
  { value: 2, name: 'Week' },
  { value: 3, name: 'Month' },
  { value: 4, name: 'Year' }
]

const errorMessage = ref('')

function save() {
  errorMessage.value = ''
  _notifications.value.forEach((n) => {
    if (n.advance < 1) {
      errorMessage.value = 'Invalid input'
      return
    }
  })
  if (errorMessage.value) return
  $emit(
    'save',
    _notifications.value.map((n) => ({
      ...n,
      hour: new Date('1900-01-01 ' + n.hour).getTime()
    }))
  )
}

function cancel() {
  $emit('close')
}
</script>

<template>
  <div>
    <button
      class="btn btn-outline btn-secondary w-full"
      onclick="my_modal_1.showModal()"
    >
      Notifications
    </button>
    <dialog id="my_modal_1" class="modal">
      <div class="modal-box flex h-1/2 flex-col overflow-clip">
        <div>
          <h2 class="mb-4 text-2xl font-bold">Notifications</h2>

          <div class="h-64 overflow-scroll">
            <div class="">
              <div
                v-for="(notification, index) in _notifications"
                :key="index"
                class="flex items-center space-x-2"
              >
                <input
                  v-model="notification.advance"
                  type="number"
                  min="1"
                  required
                  class="input input-bordered w-20 text-center"
                />

                <SelectDrop
                  v-model="notification.period"
                  :options="repetitions"
                />
                <span>before at</span>
                <input
                  v-model="notification.hour"
                  type="time"
                  class="input-numbered input"
                />

                <button
                  class="btn btn-square btn-outline btn-error"
                  @click="_notifications.splice(index, 1)"
                >
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
                </button>
              </div>
            </div>
          </div>

          <div class="mb-4 flex items-center space-x-2">
            <button
              class="btn btn-outline btn-info"
              @click="_notifications.push({ ...newNotification })"
            >
              Add
            </button>
          </div>

          <p v-if="errorMessage" class="mb-4 text-red-500">
            {{ errorMessage }}
          </p>
        </div>

        <div class="modal-action">
          <form method="dialog" class="flex w-full justify-between">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn" @click="cancel">Close</button>
            <button class="btn btn-secondary" @click="save">Save</button>
          </form>
        </div>
      </div>
    </dialog>
  </div>
</template>
