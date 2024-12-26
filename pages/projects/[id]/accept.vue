<script setup lang="js">
const $route = useRoute()
onMounted(async () => {
  let project = {}

  async function fetchProject() {
    try {
      const res = await fetch(`/api/projects/${$route.params.id}`)

      if (!res.ok) {
        throw new Error('Failed to fetch project')
      }

      project = await res.json()
    } catch (error) {
      console.error(error)
      showError('Could not fetch project')
    }
  }

  function displayProject() {
    console.log(project)
    document.getElementById('title').textContent = project.title
    document.getElementById('description').textContent = project.description

    for (const g of project.guests.waiting) {
      const li = document.createElement('li')
      li.textContent = g.name
      document.getElementById('guests-invited').appendChild(li)
    }

    for (const g of project.guests.accepted) {
      const li = document.createElement('li')
      li.textContent = g.name
      document.getElementById('guests-accepted').appendChild(li)
    }
  }

  await fetchProject()
  displayProject()

  async function acceptProject() {
    try {
      await fetch(`/api/projects/${$route.params.id}/accept`, {
        method: 'POST'
      })
    } catch (error) {
      console.error(error)
    }
    //navigateTo(`/projects/${$route.params.id}`)
  }

  async function rejectProject() {
    await fetch(`/api/projects/${$route.params.id}/accept`, {
      method: 'DELETE'
    })
    navigateTo('/')
  }

  document.getElementById('btn-accept').addEventListener('click', acceptProject)
  document.getElementById('btn-reject').addEventListener('click', rejectProject)
})
</script>

<template>
  <div class="flex flex-col gap-2 p-2">
    <div>
      <h1 id="title" class="text-2xl font-bold"></h1>
      <p id="description"></p>

      <div class="mt-4 flex flex-col gap-2">
        <h2 class="text-xl">Guests</h2>
        <h3 class="text-lg">Invited</h3>
        <ul id="guests-invited"></ul>

        <h3 class="text-lg">Accepted</h3>
        <ul id="guests-accepted"></ul>
      </div>
    </div>
    <div>
      <button class="btn btn-success w-full" id="btn-accept">Accept</button>
      <button class="btn btn-error w-full" id="btn-reject">Reject</button>
    </div>
  </div>
</template>
