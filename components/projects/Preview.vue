<script setup lang="js">
// This file is part of the projects and so is made with only js (except a few lines).
// This is a component in order to use it in the main page.

const $props = defineProps(['settings'])
let projects = []

async function fetchProjects() {
  try {
    const res = await fetch('/api/projects')

    if (!res.ok) {
      throw new Error('Failed to fetch projects')
    }

    projects = await res.json()
  } catch (error) {
    console.error(error)
    showError('Could not delete project')
  }
}

function listProjects() {
  const el_plist = document.getElementById('preview-projects-list')
  el_plist.innerHTML = ''
  if (projects.length === 0) {
    const div = document.createElement('div')
    div.innerText = 'No projects'
    div.classList.add('text-center')
    el_plist.appendChild(div)
    return
  }

  let i = 0
  for (const p in projects) {
    if (i >= $props.settings.projectsLimit) {
      break
    }

    const project = projects[p]
    const link = document.createElement('a')
    link.href = `/projects/${project.id}`
    link.innerText = project.title
    link.classList.add(
      'w-full',
      'rounded',
      'border',
      'border-neutral-700',
      'p-2',
      'hover:bg-base-100'
    )
    el_plist.appendChild(link)
    i++
  }
}

watch(
  () => $props.settings,
  () => {
    listProjects()
  },
  { deep: true }
)

onMounted(async () => {
  await fetchProjects()
  listProjects()
})
</script>

<template>
  <div
    id="preview-projects-list"
    class="flex w-full flex-col gap-2"
    @click.stop
  >
    <!--
    <NuxtLink
      v-for="n in rooms"
      :key="n.id"
      class="w-full rounded border border-neutral-700 p-2 hover:bg-base-100"
      :to="`/chat?id=${n.id}`"
    >
      {{ n.roomName }}
    </NuxtLink>

    <div v-if="rooms?.length == 0" class="text-center">No chat yet</div>
-->
  </div>
</template>
