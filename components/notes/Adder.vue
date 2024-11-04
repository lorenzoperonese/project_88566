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
      class="w-full max-w-[40rem] rounded-lg border border-neutral-300 bg-base-200 shadow-xl"
      @click.prevent=""
    >
      <input
        v-if="_adding"
        v-model="_noteTitle"
        type="text"
        placeholder="Title"
        class="w-full rounded-t-lg border-b border-b-neutral-700 bg-base-200 p-4 font-bold outline-none"
      />
      <textarea
        id="noteBody"
        v-model="_noteBody"
        type="text"
        class="w-full resize-none bg-base-200 px-4 py-2 outline-none placeholder:text-gray-600"
        placeholder="Take a note..."
        :class="{ 'rounded-lg': !_adding }"
        autosize="true"
        @click="_adding = true"
      >
      </textarea>
      <div
        v-if="_adding"
        class="flex justify-between rounded-b-lg bg-base-200 p-1"
      >
        <button class="btn btn-error" @click="del()">Delete</button>

        <div class="dropdown dropdown-hover w-52">
          <div
            tabindex="0"
            role="button"
            class="btn m-1 w-full bg-neutral-content text-neutral hover:bg-neutral-300"
          >
            <span
              class="block w-full"
              :class="{ 'text-gray-600': _selected.length == 0 }"
            >
              {{ _categoryName }}
            </span>
          </div>
          <ul
            tabindex="0"
            class="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow"
          >
            <li @click="_selected = ''">
              <a> Not categorized </a>
            </li>
            <li
              v-for="c in $props.categories"
              :key="c.id"
              @click="_selected = c.id"
            >
              <a>
                {{ c.name }}
              </a>
            </li>
          </ul>
        </div>

        <button class="btn btn-success" @click="save()">Save</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
#noteBody {
  height: v-bind('__textarea_height');
}
</style>
