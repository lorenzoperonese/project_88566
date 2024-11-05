<script setup lang="ts">
const $emits = defineEmits<{
  (e: 'update'): void
}>()

function update() {
  $emits('update')
  closeModal()
}

const modal = useTemplateRef('tm_modal')

function showModal() {
  if (modal.value) {
    modal.value.showModal()
  }
}

function closeModal() {
  if (modal.value) {
    modal.value.close()
  }
}
</script>

<template>
  <div>
    <button class="btn btn-secondary" @click="showModal">tm</button>
    <dialog ref="tm_modal" class="modal">
      <div class="modal-box">
        <TmConfig @close="closeModal" @update="update()" />
      </div>
    </dialog>
  </div>

  <!--div>
    <button class="btn btn-secondary" @click="showConfig = true">TM</button>

  </div -->
</template>
