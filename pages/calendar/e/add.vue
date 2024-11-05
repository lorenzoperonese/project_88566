<script setup lang="ts">
const route = useRoute()
console.log(route.query)
</script>

<template>
  <h1>
    {{ route.query }}
  </h1>
</template>
