<script setup lang="ts">
const $emits = defineEmits<{
  (e: 'close' | 'update'): void
}>()

const { data: _today } = await useFetch('/api/tm')

const _date = ref(formatDate(_today.value ? _today.value : Date.now()))
const _time = ref(formatTime(_today.value ? _today.value : Date.now()))

function close() {
  $emits('close')
}

async function reset() {
  await $fetch('/api/tm', {
    method: 'DELETE'
  })
  $emits('update')
}

async function save() {
  const d = new Date(_date.value + ' ' + _time.value).getTime()

  await $fetch('/api/tm', {
    method: 'POST',
    body: JSON.stringify(d)
  })

  $emits('update')
}
</script>

<template>
  <div
    class="fixed left-0 top-0 grid h-full w-full bg-gray-300 bg-opacity-50"
    @click="close()"
  >
    <div
      class="place-self-center rounded-lg border bg-white p-5 drop-shadow-lg"
      @click.stop=""
    >
      <h1 class="mb-5 w-full text-center text-lg font-bold">Time Machine</h1>
      <form class="flex flex-col gap-2" @submit.prevent="">
        <div>
          <label> Date </label>
          <input
            v-model="_date"
            type="date"
            class="w-full rounded border p-2 outline-none"
          />
        </div>

        <div>
          <label> Time </label>
          <input
            v-model="_time"
            type="time"
            class="w-full rounded border p-2 outline-none"
          />
        </div>

        <div class="mt-2">
          <button
            class="mb-2 w-full rounded-lg border bg-green-300 p-2 hover:bg-green-500"
            @click="reset()"
          >
            Reset
          </button>

          <div class="flex justify-evenly">
            <button
              class="w-20 rounded-lg border bg-red-300 p-2 hover:bg-red-500"
              @click="close()"
            >
              Cancel
            </button>
            <button
              class="w-20 rounded-lg border bg-blue-300 p-2 hover:bg-blue-500"
              @click="save()"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
