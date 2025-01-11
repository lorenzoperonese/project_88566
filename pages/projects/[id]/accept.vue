<script setup lang="js">
definePageMeta({
  layout: 'navbar'
})

const { $toast } = useNuxtApp()
const $route = useRoute()

onMounted(async () => {
  function showError(err) {
    $toast.error(err)
    document.getElementById('projects_accept_error').textContent = err
    document
      .getElementById('projects_accept_error_container')
      .classList.remove('hidden')
    document
      .getElementById('projects_accept_error_container')
      .classList.add('flex')
    document.getElementById('projects_accept_ok').classList.add('hidden')
  }

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
    navigateTo(`/projects/${$route.params.id}`)
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
  <div class="w-full max-w-md">
    <div class="flex flex-col gap-2 p-2" id="projects_accept_ok">
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
      <div class="flex justify-evenly">
        <button class="btn btn-success w-2/5" id="btn-accept">Accept</button>
        <button class="btn btn-error w-2/5" id="btn-reject">Reject</button>
      </div>
    </div>
    <div id="projects_accept_error_container" class="hidden flex-col gap-2 p-2">
      <div
        id="projects_accept_error"
        class="text-xl font-bold text-error"
      ></div>
      <a href="/projects" class="btn btn-neutral">Close</a>
    </div>
  </div>
</template>
