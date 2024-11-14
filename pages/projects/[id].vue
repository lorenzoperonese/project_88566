<script setup lang="js">
definePageMeta({
  layout: 'navbar'
})

const $route = useRoute()
</script>

<template>
  {{ $route.params.id }}
</template>
