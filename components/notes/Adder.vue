<script setup lang="ts">
const { $toast } = useNuxtApp()
const $emits = defineEmits<{
  (e: 'save', note: Note): void
}>()

const today = await getToday()

const $props = defineProps<{
  categories: NoteCategory[] | null
}>()

const _selected = ref('')

const _categoryName = computed(() => {
  if (_selected.value == '' || $props.categories === null) {
    return 'Not categorized'
  } else {
    return $props.categories.find((e) => e.id == _selected.value)?.name
  }
})

const state = ref('private')

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

const _todoDate = ref<string>(formatDate(today.getTime() + 60 * 60 * 1000))
const _todoTime = ref<string>(formatTime(today.getTime() + 60 * 60 * 1000))

interface NoteTodo {
  title: string
  date: string
  time: string
  done: boolean
}

const emptyTodo = (): NoteTodo => ({
  title: '',
  date: _todoDate.value,
  time: _todoTime.value,
  done: false
})

const _todoList = ref<NoteTodo[]>([emptyTodo()])

function del() {
  _adding.value = false
  _noteTitle.value = ''
  _noteBody.value = ''
}

const guestsIDs = ref<string[]>([])

function save() {
  if (_noteTitle.value.trim() == '') {
    $toast.error('Title is required')
    return
  }
  if (_noteBody.value.trim() == '') {
    $toast.error('Body is required')
    return
  }

  const n: Note = {
    id: '0',
    title: _noteTitle.value,
    body: _noteBody.value,
    category_id: _selected.value == '' ? undefined : _selected.value,
    state: state.value,
    shared_with: state.value == 'shared' ? guestsIDs.value : [],
    todos: _todoList.value.slice(0, -1).map((t) => ({
      title: t.title,
      end: new Date(t.date + ' ' + t.time).getTime(),
      done: t.done
    })),
    user_id: '0'
  }

  $emits('save', n)
  del()
}

const updateGuests = (g: string[], s: string) => {
  guestsIDs.value = g
  state.value = s
}

function addTodo() {
  const l = _todoList.value.length
  if (l == 0) {
    $toast.error('Something went wrong')
    return
  }

  if (_todoList.value[l - 1].title.trim() == '') {
    $toast.error('Title is required')
    return
  }

  _todoList.value.push(emptyTodo())
  return
}

function delTodo(t: NoteTodo) {
  const i = _todoList.value.indexOf(t)
  if (i == -1) {
    $toast.error('Something went wrong')
    return
  }

  _todoList.value.splice(i, 1)
}
</script>

<template>
  <div class="flex justify-center">
    <form
      class="w-full max-w-[50rem] rounded-lg border border-neutral-300 bg-base-200 shadow-xl"
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
      <div v-if="_adding" class="divider"></div>
      <div v-if="_adding" class="px-4 py-2">
        <div class="flex w-full flex-col gap-2">
          <div
            v-for="(t, indx) in _todoList"
            class="flex flex-wrap justify-evenly gap-2 border-b border-b-neutral-800 last:border-none"
          >
            <input
              v-model="t.title"
              class="input input-sm flex-1 text-xs md:input-md placeholder:text-gray-600"
              type="text"
              placeholder="Todo..."
            />
            <input
              v-model="t.date"
              class="input input-sm input-bordered text-xs md:input-md"
              type="date"
            />
            <input
              v-model="t.time"
              class="input input-sm input-bordered text-xs md:input-md"
              type="time"
            />
            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text mr-2">Completed</span>
                <input
                  v-model="t.done"
                  type="checkbox"
                  class="checkbox checkbox-sm md:checkbox-md"
                  @click.stop=""
                />
              </label>
            </div>

            <button
              v-if="indx == _todoList.length - 1"
              class="btn btn-primary btn-sm md:btn-md"
              @click.prevent="addTodo"
            >
              Add
            </button>
            <button
              v-else
              class="btn btn-error btn-sm md:btn-md"
              @click.prevent="delTodo(t)"
            >
              Del
            </button>
          </div>
        </div>
      </div>
      <div v-if="_adding" class="divider"></div>
      <div
        v-if="_adding"
        class="flex flex-wrap justify-evenly gap-y-2 rounded-b-lg bg-base-200 p-1 md:justify-between"
      >
        <button
          class="btn btn-error btn-sm order-2 md:btn-md md:order-1"
          @click.prevent="del()"
        >
          Cancel
        </button>

        <div class="order-1 flex gap-4 md:order-2">
          <div class="dropdown dropdown-hover w-52">
            <div
              tabindex="0"
              role="button"
              class="btn btn-sm w-full bg-neutral-content text-neutral md:btn-md hover:bg-neutral-300"
            >
              <span
                class="block w-full text-sm md:text-base"
                :class="{ 'text-gray-600': _selected.length == 0 }"
              >
                {{ _categoryName }}
              </span>
            </div>
            <ul
              tabindex="0"
              class="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 shadow *:text-sm md:p-2 md:*:text-base"
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

          <NotesState @save="updateGuests" />
        </div>

        <button
          class="btn btn-success btn-sm order-3 md:btn-md"
          @click.prevent="save()"
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
