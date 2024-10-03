<script setup lang="ts">
const $emits = defineEmits<{
  (e: 'update'): void
}>()

const showConfig = ref(false)

function update() {
  $emits('update')
  showConfig.value = false
}
</script>

<template>
  <div>
    <button
      class="rounded-lg bg-green-300 p-4 hover:bg-green-500"
      @click="showConfig = true"
    >
      TM
    </button>

    <TmConfig
      v-if="showConfig"
      @close="showConfig = false"
      @update="update()"
    />
  </div>
</template>
