<script setup lang="ts">
const theme = ref('dark')

fetch('/api/session')
  .then((response) => {
    if (!response.ok) {
      throw new Error('During profile fetch: ' + response.statusText)
    }
    return response.json()
  })
  .then((data) => {
    if (data) {
      theme.value = data.theme
      document.documentElement.setAttribute('data-theme', theme.value)
    }
  })
  .catch((e) => {
    console.error(e)
  })

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
function changeTheme() {
  document.documentElement.setAttribute('data-theme', theme.value)
}
</script>
<template>
  <div>
    <div class="flex justify-between">
      <span class="flex items-center"> Theme </span>
      <div class="flex justify-evenly gap-4">
        <select v-model="theme" class="select select-bordered">
          <option v-for="t in themes" :key="t" :value="t" @click="changeTheme">
            {{ t }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>
