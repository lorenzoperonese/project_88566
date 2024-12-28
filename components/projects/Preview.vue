<script setup lang="js">
// This file is part of the projects and so is made with only js.
// This is a component in order to use it in the main page.

onMounted(async () => {
  let projects = []

  async function fetchProjects() {
    console.log('Fetching projects')
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
    console.log('Listing projects')
    let el_plist = document.getElementById('preview-projects-list')
    console.log(projects)
    console.log(projects.length)
    if (projects.length == 0) {
      let div = document.createElement('div')
      div.innerText = 'No projects'
      div.classList.add('text-center')
      el_plist.appendChild(div)
      return
    }

    el_plist.innerHTML = ''
    for (const p in projects) {
      let project = projects[p]
      let link = document.createElement('a')
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
    }
  }

  await fetchProjects()
  listProjects()
})
</script>

<template>
  <div
    class="flex w-full flex-col gap-2"
    id="preview-projects-list"
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
