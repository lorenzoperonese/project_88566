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
    <button class="btn btn-secondary" @click="showConfig = true">TM</button>

    <TmConfig
      v-if="showConfig"
      @close="showConfig = false"
      @update="update()"
    />
  </div>
</template>
