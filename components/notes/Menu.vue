<script setup lang="ts">
const _search = defineModel<string>({
  required: true
})

const $props = defineProps<{
  categories: NoteCategory[] | null
}>()

const $emits = defineEmits<{
  (e: 'delete-category', id: string): void
  (e: 'add-category', c: NoteCategory): void
}>()

const _newCategory = ref('')

const deleteCategory = (id: string) => {
  $emits('delete-category', id)
}

const addCategory = () => {
  if (_newCategory.value.trim() == '') return
  const c: NoteCategory = { id: '0', name: _newCategory.value }
  $emits('add-category', c)

  _newCategory.value = ''
}
</script>

<template>
  <div class="flex flex-col bg-base-100 p-2">
    <label class="input input-bordered flex items-center gap-2">
      <input v-model="_search" type="text" class="grow" placeholder="Search" />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        class="h-4 w-4 opacity-70"
      >
        <path
          fill-rule="evenodd"
          d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
          clip-rule="evenodd"
        />
      </svg>
    </label>

    <div class="divider"></div>
    <div class="">
      <div class="text-lg font-bold">Categories</div>
      <div class="mt-2">
        <ul class="list-inside list-disc">
          <li
            v-for="category in $props.categories"
            :key="category.id"
            class="flex justify-between"
          >
            <div>
              {{ category.name }}
            </div>
            <button
              class="text-gray-400 hover:text-black"
              @click="deleteCategory(category.id)"
            >
              <svg
                class="h-5 w-5 text-gray-500 hover:text-red-400"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </li>
        </ul>
      </div>
      <div class="mt-1 flex justify-between">
        <input
          v-model="_newCategory"
          type="text"
          placeholder="New category"
          class="py w-full max-w-xs bg-base-100 outline-none placeholder:text-neutral-600 hover:border-b hover:border-b-neutral focus:border-b focus:border-b-neutral"
          @keyup.enter="addCategory"
        />

        <button
          class="text-xl text-gray-400 hover:text-black"
          @click="addCategory"
        >
          <svg
            class="h-5 w-5 text-gray-500 hover:text-gray-100"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" />
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
