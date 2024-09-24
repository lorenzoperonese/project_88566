<script setup lang="ts">
const _route = useRoute()
const _id = _route.params.id
const { data } = await useFetch(`/api/notes/${_id}`)

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

async function save() {
  if (data.value) {
    try {
      await $fetch(`/api/notes/${_id}`, {
        method: 'put',
        body: {
          title: data.value.title,
          body: data.value.body,
          category_id: _selected.value == '' ? undefined : _selected.value
        }
      })
      const router = useRouter()
      router.push(`/notes/${_id}`)
    } catch (err) {
      console.log(err)
    }
  }
}
</script>

<template>
  <div class="h-full p-2">
    <h1 class="m-2 mb-5 w-full text-center text-3xl font-bold">Note Editor</h1>
    <form
      v-if="data"
      class="flex rounded-lg border bg-gray-50"
      @click.prevent=""
    >
      <div class="w-full">
        <div class="flex justify-between p-4">
          <input
            v-model="data.title"
            type="text"
            class="w-full rounded-t-lg bg-transparent text-2xl font-bold outline-none focus:underline"
          />
          <div class="group w-60 hover:drop-shadow-lg">
            <div class="w-60 rounded-t-lg p-2 group-hover:bg-white">
              Category: {{ _categoryName }}
            </div>
            <div>
              <ul
                class="collapse absolute w-60 rounded-b-lg bg-white group-hover:visible"
              >
                <li
                  class="p-2 text-gray-600 hover:bg-gray-100"
                  @click="_selected = ''"
                >
                  Not categorized
                </li>
                <li
                  v-for="c in _categories"
                  :key="c.id"
                  class="p-2 hover:bg-gray-100"
                  :class="{ 'bg-gray-100': _selected == c.id }"
                  @click="_selected = c.id"
                >
                  {{ c.name }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="w-full">
          <textarea
            id="noteBody"
            v-model="data.body"
            class="w-full resize-none rounded-b-lg bg-transparent p-4 outline-none"
          >
          </textarea>
        </div>
      </div>

      <div class="flex items-center">
        <div class="flex h-40 max-h-96 flex-col justify-evenly">
          <button
            class="rounded-lg border bg-blue-200 p-2 hover:bg-blue-400"
            @click="save()"
          >
            Save
          </button>
          <NuxtLink
            class="rounded-lg border bg-red-200 p-2 hover:bg-red-400"
            :to="`/notes/${data.id}`"
          >
            Cancel
          </NuxtLink>
        </div>
      </div>
    </form>

    <!-- Error -->
    <div v-else class="grid h-full">
      <div class="place-self-center">
        <div class="font-bold text-red-700">Something went wrong :(</div>
        <div class="mt-5 flex justify-center">
          <NuxtLink
            to="/"
            class="rounded-lg border bg-blue-200 p-2 hover:bg-blue-400"
          >
            Home
          </NuxtLink>
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
