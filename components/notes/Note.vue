<script setup lang="ts">
const { $toast } = useNuxtApp()

const $props = defineProps({
  note: { type: Object as PropType<Note>, required: true }
})

const categories = inject('notesCategories') as Ref<NoteCategory[]>

const _categoryName = computed(() => {
  if (categories) {
    if ($props.note.category_id) {
      return categories.value.find((e) => e.id == $props.note.category_id)?.name
    } else {
      return 'Not categorized'
    }
  }

  return 'Error'
})

const $emits = defineEmits<{
  (e: 'delete' | 'duplicate'): void
}>()

const me = await getME()

const isMine = computed(() => {
  return $props.note.user_id === me.id
})

const copyToClipboard = async () => {
  try {
    const content = $props.note.body
    await navigator.clipboard.writeText(content)
    $toast.success('Copied to clipboard')
  } catch (err) {
    $toast.error('Failed to copy to clipboard')
  }
}

const fBody = computed(() => {
  if ($props.note.body.length < 403) {
    return $props.note.body
  }
  return $props.note.body.substring(0, 400) + '...'
})
</script>

<template>
  <div class="card w-full bg-base-200 shadow-lg">
    <div class="card-body">
      <div class="flex flex-col md:flex-row">
        <div class="mr-4 w-full">
          <NuxtLink :to="`/notes/${$props.note.id}`">
            <!-- div>ID: {{ $props.note.id }}</div -->
            <div class="flex justify-between">
              <div class="text-2xl font-extrabold">{{ $props.note.title }}</div>
              <div class="flex h-full gap-6 text-gray-300">
                <div class="h-full">
                  {{ _categoryName }}
                </div>
                <div>
                  {{ $props.note.state }}
                </div>
              </div>
            </div>
            <div class="prose prose-sm">
              <MDC :value="fBody" />
            </div>
            <div
              v-show="$props.note.todos && $props.note.todos.length > 0"
              class="divider"
            ></div>
            <div>
              <div v-for="t in $props.note.todos" class="flex gap-4">
                <div :class="{ 'line-through': t.done }">
                  {{ t.title }}
                </div>
                <div>{{ formatTime(t.end) }} {{ formatDate(t.end) }}</div>
              </div>
            </div>
          </NuxtLink>
        </div>
        <div
          v-show="$props.note.todos && $props.note.todos.length > 0"
          class="divider md:hidden"
        ></div>
        <div class="flex flex-row flex-wrap justify-evenly gap-2 md:flex-col">
          <button
            class="btn btn-neutral btn-sm md:btn-md"
            @click="copyToClipboard"
          >
            Copy to clipboard
          </button>
          <NuxtLink
            v-if="isMine"
            class="btn btn-info btn-sm md:btn-md"
            :to="`/notes/editor/${$props.note.id}`"
          >
            Modify
          </NuxtLink>
          <button
            class="btn btn-accent btn-sm md:btn-md"
            @click="$emits('duplicate')"
          >
            Duplicate
          </button>
          <button
            v-if="isMine"
            class="btn btn-error btn-sm md:btn-md"
            @click="$emits('delete')"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
