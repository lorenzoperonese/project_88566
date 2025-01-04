<script setup lang="ts">
const $props = defineProps({
  resource: { type: Object as PropType<Resource>, required: true },
  today: { type: Date, required: true },
  displayDate: { type: Date, required: false }
})

const isInPast = computed(() => {
  if ($props.displayDate) {
    return isInThePast($props.today, $props.displayDate)
  } else {
    return false
  }
})

const me = await getME()
</script>

<template>
  <NuxtLink :to="isAdmin(me) ? `/calendar/r/${resource.id}` : ''">
    <div
      class="mt-1 w-full cursor-pointer rounded bg-info-content p-1 text-xs text-info hover:bg-blue-200"
      :class="{ 'opacity-60': isInPast }"
    >
      <div class="overflow-x-clip whitespace-nowrap font-semibold">
        {{ resource.title }}
      </div>
      <div class="hidden md:block">
        {{ formatTime(resource.start) }} - {{ formatTime(resource.end) }}
      </div>
    </div>
  </NuxtLink>
</template>
