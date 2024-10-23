<script setup lang="ts">
const $emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', n: Notify[] | []): void
}>()

const $props = defineProps<{
  notifications: Notify[]
}>()

const _notifications = ref($props.notifications)

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
  $emit('save', _notifications.value)
}

function cancel() {
  $emit('close')
}
</script>

<template>
  <div
    class="fixed inset-0 flex h-full w-full items-center justify-center overflow-y-auto bg-gray-600 bg-opacity-50"
    @click="cancel"
  >
    <div
      class="flex max-h-[90vh] w-full max-w-md flex-col rounded-lg bg-white p-6 shadow-xl"
      @click.stop
    >
      <h2 class="mb-4 text-2xl font-bold">Notifications</h2>

      <div class="mb-6 flex-grow space-y-4 overflow-y-auto">
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
            class="w-16 rounded border p-2"
          />
          <select v-model="notification.period" class="rounded border p-2">
            <option value="1">
              {{ notification.advance === 1 ? 'Minute' : 'Minutes' }}
            </option>
            <option value="2">
              {{ notification.advance === 1 ? 'Hour' : 'Hours' }}
            </option>
            <option value="3">
              {{ notification.advance === 1 ? 'Day' : 'Days' }}
            </option>
            <option value="4">
              {{ notification.advance === 1 ? 'Week' : 'Weeks' }}
            </option>
          </select>
          <span>before</span>

          <button
            class="text-red-500 hover:text-red-700"
            @click="_notifications.splice(index, 1)"
          >
            X
          </button>
        </div>
      </div>

      <div class="mb-4 flex items-center space-x-2">
        <button
          class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          @click="_notifications.push({ advance: 1, period: 1 })"
        >
          Add
        </button>
      </div>

      <p v-if="errorMessage" class="mb-4 text-red-500">{{ errorMessage }}</p>

      <div class="flex justify-end space-x-4">
        <button
          class="rounded bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
          @click="cancel"
        >
          Cancel
        </button>
        <button
          class="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          @click="save"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>
