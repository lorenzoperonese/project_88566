<script setup lang="ts">
const theme = ref('dark')

theme.value = await setThemeFromBackend()

const themes = [
  'light',
  'dark',
  'cupcake',
  'bumblebee',
  'emerald',
  'corporate',
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'halloween',
  'garden',
  'forest',
  'aqua',
  'lofi',
  'pastel',
  'fantasy',
  'wireframe',
  'black',
  'luxury',
  'dracula',
  'cmyk',
  'autumn',
  'business',
  'acid',
  'lemonade',
  'night',
  'coffee',
  'winter',
  'dim',
  'nord',
  'sunset'
]

async function changeTheme() {
  document.documentElement.setAttribute('data-theme', theme.value)
  await $fetch('/api/session', {
    method: 'PUT',
    body: JSON.stringify({ theme: theme.value })
  })
}
</script>
<template>
  <div>
    <div class="flex justify-between">
      <span class="flex items-center"> Theme </span>
      <div class="flex justify-evenly gap-4">
        <select
          v-model="theme"
          class="select select-bordered"
          @change="changeTheme"
        >
          <option v-for="t in themes" :key="t" :value="t">
            {{ t }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>
