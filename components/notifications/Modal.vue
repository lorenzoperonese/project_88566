<script setup lang="ts">
const $props = defineProps<{
  pending: number | null
}>()

const $emits = defineEmits<{
  (e: 'update'): void
}>()

const modal = useTemplateRef('modal')

function showModal() {
  modal.value?.showModal()
}

function closeModal() {
  modal.value?.close()
}
</script>

<template>
  <div>
    <button class="btn btn-circle btn-ghost" @click="showModal">
      <div class="indicator">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        <span
          v-show="$props.pending != 0"
          class="badge indicator-item badge-primary badge-xs"
        ></span>
      </div>
    </button>

    <dialog ref="modal" class="modal modal-bottom sm:modal-middle">
      <div class="modal-box">
        <h3 class="mb-2 text-lg font-bold">Notifications</h3>
        <NotificationsList @update="$emits('update')" />
        <div class="modal-action">
          <form method="dialog">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn" @click="closeModal">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  </div>
</template>
