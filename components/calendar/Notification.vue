<script setup lang="ts">
const $emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', n: Notify[] | []): void
}>()

const $props = defineProps<{
  notifications: Notify[]
}>()

const _notifications = ref<Notify[]>(
  structuredClone(toRaw($props.notifications))
)

function repetitions(n: number) {
  const base = [
    { value: 1, name: 'Minute' },
    { value: 2, name: 'Hour' },
    { value: 3, name: 'Day' },
    { value: 4, name: 'Week' }
  ]
  if (n != 1) {
    for (let i = 0; i < base.length; i++) base[i].name += 's'
  }
  return base
}

const errorMessage = ref('')

function validate(notification: Notify): boolean {
  if (notification.advance < 1) return false
  if (notification.repeat) {
    if (notification.repeat.interval < 1) return false
    if (!notification.repeat.untilResponse && notification.repeat.count < 1)
      return false
  }
  return true
}

function save() {
  errorMessage.value = ''
  for (const notification of _notifications.value) {
    if (!validate(notification)) {
      errorMessage.value =
        'Invalid input in notifications or repetition settings'
      return
    }
  }
  if (errorMessage.value) return
  $emit('save', _notifications.value)
}

const modal = useTemplateRef('notification_modal')

function showModal() {
  _notifications.value = structuredClone(toRaw($props.notifications))
  if (modal.value) {
    modal.value.showModal()
  }
}

function cancel() {
  $emit('close')
}

function addRepetition(notification: Notify) {
  notification.repeat = {
    count: 1,
    interval: 1,
    intervalUnit: 1,
    untilResponse: false
  }
}

function removeRepetition(notification: Notify) {
  notification.repeat = undefined
}
</script>

<template>
  <div>
    <button class="btn btn-outline btn-accent w-full" @click="showModal">
      Notifications
    </button>
    <dialog ref="notification_modal" class="modal">
      <div class="modal-box flex h-3/4 flex-col overflow-clip">
        <div>
          <h2 class="mb-4 text-2xl font-bold">Notifications</h2>
          <div class="h-96 overflow-scroll">
            <div class="space-y-4">
              <div
                v-for="(notification, index) in _notifications"
                :key="index"
                class="rounded border p-4"
              >
                <div class="mb-2 flex items-center space-x-2">
                  <input
                    v-model="notification.advance"
                    type="number"
                    min="1"
                    required
                    class="input input-bordered w-20 text-center"
                  />
                  <SelectDrop
                    v-model="notification.period"
                    :options="repetitions(notification.advance)"
                  />
                  <span>before</span>
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

                <!-- Repetition Controls -->
                <div v-if="!notification.repeat" class="mt-2">
                  <button
                    class="btn btn-outline btn-xs"
                    @click="addRepetition(notification)"
                  >
                    Add Repetition
                  </button>
                </div>

                <div v-if="notification.repeat" class="mt-2 space-y-2">
                  <div class="flex items-center space-x-2">
                    <div class="form-control">
                      <label class="label cursor-pointer space-x-2">
                        <span class="label-text">Repeat until response</span>
                        <input
                          v-model="notification.repeat.untilResponse"
                          type="checkbox"
                          class="checkbox checkbox-sm"
                        />
                      </label>
                    </div>
                  </div>

                  <div
                    v-if="!notification.repeat.untilResponse"
                    class="flex items-center space-x-2"
                  >
                    <span>Repeat</span>
                    <input
                      v-model="notification.repeat.count"
                      type="number"
                      min="1"
                      class="input input-sm input-bordered w-20 text-center"
                    />
                    <span>times</span>
                  </div>

                  <div class="flex items-center space-x-2">
                    <span>Every</span>
                    <input
                      v-model="notification.repeat.interval"
                      type="number"
                      min="1"
                      class="input input-sm input-bordered w-20 text-center"
                    />
                    <SelectDrop
                      v-model="notification.repeat.intervalUnit"
                      :options="repetitions(notification.repeat.interval)"
                    />
                  </div>

                  <button
                    class="btn btn-outline btn-error btn-xs"
                    @click="removeRepetition(notification)"
                  >
                    Remove Repetition
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="mb-4 mt-4 flex items-center space-x-2">
            <button
              class="btn btn-outline btn-info"
              @click="_notifications.push({ advance: 1, period: 2 })"
            >
              Add Notification
            </button>
          </div>

          <p v-if="errorMessage" class="mb-4 text-red-500">
            {{ errorMessage }}
          </p>
        </div>

        <div class="modal-action mt-auto">
          <form method="dialog" class="flex w-full justify-between">
            <button class="btn" @click="cancel">Close</button>
            <button class="btn btn-secondary" @click="save">Save</button>
          </form>
        </div>
      </div>
    </dialog>
  </div>
</template>
