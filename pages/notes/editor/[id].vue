<script setup lang="ts">
definePageMeta({
  layout: 'navbar'
})
const { $toast } = useNuxtApp()
const _route = useRoute()
const _id = _route.params.id
const { data } = await useFetch(`/api/notes/${_id}`)

const state = ref('private')
const guestsIDs = ref<string[]>([])

const _selected = ref(data.value?.category_id)

const __textarea_height = computed(() => {
  if (data.value) {
    const l = data.value.body.split(/\r\n|\r|\n/).length
    return ((l < 10 ? 1.7 : 1.55) * (l == 1 ? 3 : l + 1)).toString() + 'em'
  } else {
    return '4rem'
  }
})

const _categories = await $fetch('/api/notes-categories')

const _categoryName = computed(() => {
  if (data.value) {
    if (data.value.category_id) {
      return _categories.find((e) => e.id == _selected.value)?.name
    } else {
      return 'Not categorized'
    }
  }

  return 'Error'
})

const today = await getToday()

interface NoteTodo {
  title: string
  date: string
  time: string
  done: boolean
}

const _todoDate = ref<string>(formatDate(today.getTime() + 60 * 60 * 1000))
const _todoTime = ref<string>(formatTime(today.getTime() + 60 * 60 * 1000))
const _todoList = ref<NoteTodo[]>(
  data.value?.todos?.map((t) => ({
    title: t.title,
    date: formatDate(t.end),
    time: formatTime(t.end),
    done: t.done
  })) || []
)

const emptyTodo = (): NoteTodo => ({
  title: '',
  date: _todoDate.value,
  time: _todoTime.value,
  done: false
})
_todoList.value.push(emptyTodo())

async function save() {
  if (data.value) {
    if (data.value.title.trim() === '') {
      $toast.error('Title is required')
    } else if (data.value.body.trim() === '') {
      $toast.error('Body is required')
    } else {
      try {
        await $fetch(`/api/notes/${_id}`, {
          method: 'PUT',
          body: {
            title: data.value.title,
            body: data.value.body,
            category_id: _selected.value == '' ? undefined : _selected.value,
            state: state.value,
            shared_with: state.value == 'shared' ? guestsIDs.value : [],
            todos: _todoList.value.slice(0, -1).map((t) => ({
              title: t.title,
              end: new Date(t.date + ' ' + t.time).getTime(),
              done: t.done
            }))
          }
        })
        navigateTo(`/notes/${_id}`)
      } catch (err) {
        console.error(err)
      }
    }
  }
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
  <div class="h-full p-2">
    <h1 class="m-2 mb-5 w-full text-center text-3xl font-bold">Note Editor</h1>
    <form
      v-if="data"
      class="flex flex-col gap-4 rounded-lg border bg-base-200 p-4 md:flex-row"
      @click.prevent=""
    >
      <div class="w-full">
        <div class="flex flex-col justify-between gap-4 md:flex-row md:gap-0">
          <input
            v-model="data.title"
            type="text"
            class="order-2 w-full rounded-t-lg bg-transparent text-2xl font-bold outline-none focus:underline md:order-1"
          />

          <div class="order-1 flex justify-between gap-2 md:order-2">
            <div class="dropdown dropdown-hover">
              <div
                tabindex="0"
                role="button"
                class="btn btn-sm border border-neutral md:btn-md"
              >
                <div class="rounded-t-lg p-2 group-hover:bg-white md:w-60">
                  Category: {{ _categoryName }}
                </div>
              </div>
              <ul
                tabindex="0"
                class="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow"
              >
                <li @click="_selected = ''">
                  <a> Not categorized </a>
                </li>
                <li
                  v-for="c in _categories"
                  :key="c.id"
                  @click="_selected = c.id"
                >
                  <a> {{ c.name }} </a>
                </li>
              </ul>
            </div>
            <div>
              <NotesState :state="data.state" @save="updateGuests" />
            </div>
          </div>
        </div>
        <div class="divider"></div>
        <div class="w-full">
          <textarea
            id="noteBody"
            v-model="data.body"
            class="w-full resize-none rounded-b-lg bg-transparent outline-none"
          >
          </textarea>
        </div>
        <div class="divider"></div>
        <div class="flex w-full max-w-[50rem] flex-col gap-2">
          <div
            v-for="(t, indx) in _todoList"
            class="flex flex-wrap justify-evenly gap-2 border-b border-b-neutral-800 pb-2 last:border-none md:border-none"
          >
            <input
              v-model="t.title"
              class="input input-sm text-xs md:input-md placeholder:text-gray-600"
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

      <div class="flex items-center">
        <div
          class="flex h-full max-h-60 w-full flex-row justify-evenly gap-2 md:flex-col"
        >
          <button class="btn btn-success" @click="save()">Save</button>
          <NuxtLink class="btn btn-error" :to="`/notes/${data.id}`">
            Cancel
          </NuxtLink>
        </div>
      </div>
    </form>

    <!-- Error -->
    <div v-else class="grid h-full">
      <div class="place-self-center">
        <div class="text-2xl font-bold text-error">Something went wrong :(</div>
        <div class="mt-5 flex justify-center">
          <NuxtLink to="/" class="btn btn-info"> Home </NuxtLink>
        </div>
      </div>
    </div>
    <!-- End Error -->
  </div>
</template>

<style scoped>
#noteBody {
  height: v-bind('__textarea_height');
}
</style>
