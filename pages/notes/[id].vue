<script setup lang="ts">
const _route = useRoute()
const _id = _route.params.id
const _note = await $fetch(`/api/notes/${_id}`)

</script>

<template>
  <div class="p-2">
    <div v-if="_note">
      <h1 class="text-2xl font-bold">
        {{ _note.title }}
      </h1>
      <p>
        {{ _note.body }}
      </p>
    </div>
    <div v-else>Something went wrong :(</div>
  </div>
</template>
