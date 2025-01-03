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
</script>

<template>
  <div class="card w-full bg-base-200 shadow-lg">
    <div class="card-body">
      <div class="flex">
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
              <MDC :value="$props.note.body" />
            </div>
            <div class="divider"></div>
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
        <div class="flex flex-col gap-2">
          <button class="btn btn-neutral" @click="copyToClipboard">
            Copy to clipboard
          </button>
          <NuxtLink
            v-if="isMine"
            class="btn btn-info"
            :to="`/notes/editor/${$props.note.id}`"
          >
            Modify
          </NuxtLink>
          <button class="btn btn-accent" @click="$emits('duplicate')">
            Duplicate
          </button>
          <button v-if="isMine" class="btn btn-error" @click="$emits('delete')">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
