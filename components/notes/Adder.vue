<script setup lang="ts">
const $emits = defineEmits<{
  (e: 'save', note: Note): void
}>()

const _adding = ref(false)
const _noteTitle = ref('')
const _noteBody = ref('')
const __textarea_height = computed(() => {
  if (!_adding.value) {
    return '2.5rem'
  } else {
    return (
      (1.5 * (_noteBody.value.split(/\r\n|\r|\n/).length + 1)).toString() + 'em'
    )
  }
})

function del() {
  _adding.value = false
  _noteTitle.value = ''
  _noteBody.value = ''
}

function save() {
  const n: Note = {
    id: '0',
    title: _noteTitle.value,
    body: _noteBody.value
  }

  $emits('save', n)
  del()
}
</script>

<template>
  <div class="flex justify-center">
    <form
      class="w-full max-w-[40rem] rounded-lg border drop-shadow-md"
      @click.prevent=""
    >
      <input
        v-if="_adding"
        v-model="_noteTitle"
        type="text"
        placeholder="Title"
        class="w-full rounded-t-lg p-4 font-bold outline-none"
      />
      <textarea
        id="noteBody"
        v-model="_noteBody"
        type="text"
        class="w-full resize-none px-4 py-2 outline-none placeholder:text-gray-600"
        placeholder="Take a note..."
        :class="{ 'rounded-lg': !_adding }"
        autosize="true"
        @click="_adding = true"
      >
      </textarea>
      <div
        v-if="_adding"
        class="flex justify-between rounded-b-lg bg-white p-1"
      >
        <button class="rounded-lg p-2 hover:bg-gray-100" @click="del()">
          Delete
        </button>
        <button class="rounded-lg p-2 hover:bg-gray-100" @click="save()">
          Save
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
#noteBody {
  height: v-bind('__textarea_height');
}
</style>
