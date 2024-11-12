<script setup lang="ts">
definePageMeta({
  layout: 'navbar'
})
const { $toast } = useNuxtApp()
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
    if (data.value.title.trim() === '') {
      $toast.error('Title is required')
    } else if (data.value.body.trim() === '') {
      $toast.error('Body is required')
    } else {
      try {
        await $fetch(`/api/notes/${_id}`, {
          method: 'put',
          body: {
            title: data.value.title,
            body: data.value.body,
            category_id: _selected.value == '' ? undefined : _selected.value
          }
        })
        navigateTo(`/notes/${_id}`)
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<template>
  <div class="h-full p-2">
    <h1 class="m-2 mb-5 w-full text-center text-3xl font-bold">Note Editor</h1>
    <form
      v-if="data"
      class="flex gap-4 rounded-lg border bg-base-200 p-4"
      @click.prevent=""
    >
      <div class="w-full">
        <div class="flex justify-between">
          <input
            v-model="data.title"
            type="text"
            class="w-full rounded-t-lg bg-transparent text-2xl font-bold outline-none focus:underline"
          />

          <div class="dropdown dropdown-hover">
            <div
              tabindex="0"
              role="button"
              class="btn m-1 border border-neutral"
            >
              <div class="w-60 rounded-t-lg p-2 group-hover:bg-white">
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
        </div>
        <div class="w-full">
          <textarea
            id="noteBody"
            v-model="data.body"
            class="w-full resize-none rounded-b-lg bg-transparent outline-none"
          >
          </textarea>
        </div>
      </div>

      <div class="flex items-center">
        <div class="flex h-40 max-h-96 flex-col justify-evenly">
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
