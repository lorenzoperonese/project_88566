<script setup lang="ts">
const $emits = defineEmits<{
  (e: 'save', note: Note): void
}>()

const $props = defineProps({
  categories: { type: Array as PropType<NoteCategory[]>, required: true }
})

const _selected = ref('')

const _categoryName = computed(() => {
  if (_selected.value == '') {
    return 'Not categorized'
  } else {
    return $props.categories.find((e) => e.id == _selected.value)?.name
  }
})

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
    body: _noteBody.value,
    category_id: _selected.value == '' ? undefined : _selected.value
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
        <button
          class="rounded-lg bg-red-200 p-2 hover:bg-red-400"
          @click="del()"
        >
          Delete
        </button>
        <div
          class="group w-72 bg-white hover:rounded-t-lg hover:border-x hover:border-t"
        >
          <div
            class="flex h-full w-full items-center p-1 align-middle group-hover:border-b"
          >
            <span
              class="block"
              :class="{ 'text-gray-600': _selected.length == 0 }"
            >
              {{ _categoryName }}
            </span>
          </div>
          <ul
            class="bg-whiteborder-x collapse absolute w-72 rounded-b-lg border-b bg-white group-hover:visible"
          >
            <li
              class="p-2 text-gray-600 hover:bg-gray-100"
              @click="_selected = ''"
            >
              Not categorized
            </li>
            <li
              v-for="c in $props.categories"
              :key="c.id"
              class="p-2 hover:bg-gray-100"
              :class="{ 'bg-gray-100': _selected == c.id }"
              @click="_selected = c.id"
            >
              {{ c.name }}
            </li>
          </ul>
        </div>
        <button
          class="rounded-lg bg-blue-200 p-2 hover:bg-blue-400"
          @click="save()"
        >
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
