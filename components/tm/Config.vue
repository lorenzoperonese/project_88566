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
  <div class="" @click.stop="">
    <h1 class="mb-5 w-full text-center text-lg font-bold">Time Machine</h1>
    <form class="flex flex-col gap-2" @submit.prevent="">
      <div class="flex justify-evenly">
        <div>
          <label> Date </label>
          <input v-model="_date" type="date" class="input input-bordered" />
        </div>

        <div>
          <label> Time </label>
          <input v-model="_time" type="time" class="input input-bordered" />
        </div>
      </div>

      <div class="mt-2">
        <div class="flex justify-evenly">
          <button class="btn btn-neutral" @click="close()">Cancel</button>

          <button class="btn btn-warning" @click="reset()">Reset</button>

          <button class="btn btn-success" @click="save()">Save</button>
        </div>
      </div>
    </form>
  </div>
</template>
