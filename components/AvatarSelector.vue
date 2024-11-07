<script setup lang="ts">
const avatar = defineModel({
  type: String,
  required: true
})
</script>

<template>
  <div>
    <img
      :src="getAvatarLink(avatar)"
      alt="avatar"
      class="h-20 w-20 rounded-full"
    />
  </div>
</template>
