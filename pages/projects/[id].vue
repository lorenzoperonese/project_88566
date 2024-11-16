<script setup lang="js">
definePageMeta({
  layout: 'navbar'
})

const $route = useRoute()
const { $toast } = useNuxtApp()

onMounted(async () => {
  // ------ Error -----
  let error = ''
  function showError(msg) {
    error = msg
    $toast.error(error)
  }

  // ------ Project ------
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

  let tasks = []

  async function fetchTasks() {
    try {
      const res = await fetch(`/api/projects-tasks/${$route.params.id}`)

      if (!res.ok) {
        throw new Error('Failed to fetch tasks')
      }

      tasks = await res.json()
    } catch (error) {
      console.error(error)
      showError('Could not fetch tasks')
    }
  }

  function displayProject() {
    document.getElementById('project-title').innerHTML = project.title
    document.getElementById('project-description').innerHTML =
      project.description
  }

  function diplayTasks() {
    let tasks_el = document.getElementById('tasks-list')

    if (tasks.length === 0) {
      tasks_el.innerHTML = 'No tasks'
      return
    }

    tasks_el.innerHTML = tasks
      .map((task) => {
        return `<div>${task.title}</div>`
      })
      .join('')
  }

  await fetchProject()
  displayProject()
  await fetchTasks()
  diplayTasks()
  console.log('project: ', project)

  // ------ Task modal ------

  async function allUsers() {
    let users = []

    let me = await getME()
    users.push(me)

    project.guests.waiting.forEach((user) => {
      users.push(user)
    })
    project.guests.accepted.forEach((user) => {
      users.push(user)
    })

    return users
  }

  async function inserUsersIntoSelect() {
    let select = document.getElementById('select-user')
    let users = await allUsers()
    console.log(users)
    select.innerHTML = users
      .map((user) => {
        return `<option value="${user.id}">${user.name}</option>`
      })
      .join('')
  }

  function insertTasksIntoSelect() {
    let select = document.getElementById('select-depends')

    if (tasks.length === 0) {
      select.innerHTML = '<option value="">No tasks yet</option>'
      select.disabled = true
      return
    }

    select.innerHTML = tasks
      .map((task) => {
        return `<option value="${task.id}">${task.title}</option>`
      })
      .join('')
  }

  insertTasksIntoSelect()
  inserUsersIntoSelect()
})
</script>

<template>
  <div class="flex flex-col gap-2 p-2">
    <h1 id="project-title" class="text-2xl font-bold"></h1>
    <p id="project-description" class=""></p>
    <div>
      <div id="tasks-list"></div>

      <button
        class="btn btn-outline btn-primary"
        onclick="my_modal_5.showModal()"
      >
        Add task
      </button>
      <dialog id="my_modal_5" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
          <h3 class="text-center text-lg font-bold">Add Task</h3>
          <form class="flex flex-col gap-2">
            <div class="form-control">
              <label for="title">Title</label>
              <input id="title" type="text" class="input input-bordered" />
            </div>

            <div class="form-control">
              <label for="description">Description</label>
              <textarea
                id="description"
                type="text"
                class="textarea textarea-bordered"
              >
              </textarea>
            </div>

            <div class="form-control">
              <label for="phase">Phase</label>
              <input id="phase" type="text" class="input input-bordered" />
            </div>

            <div class="form-control bordered">
              <label for="status">State</label>
              <select class="select select-bordered w-full max-w-xs">
                <option value="todo">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
                <option value="abbandoned">Abbandoned</option>
              </select>
            </div>

            <div class="flex justify-between">
              <div class="flex gap-2">
                <label for="start" class="flex items-center">Start</label>
                <input id="start" type="date" class="input input-bordered" />
              </div>

              <div class="flex gap-2">
                <label for="End" class="flex items-center">End</label>
                <input id="end" type="date" class="input input-bordered" />
              </div>
            </div>

            <div class="form-control bordered">
              <label for="select-depends">Depends</label>
              <select
                class="select select-bordered w-full max-w-xs"
                id="select-depends"
              >
                <!-- NEED TO FILL -->
              </select>
            </div>

            <div class="form-control bordered">
              <label for="select-user">User</label>
              <select
                class="select select-bordered w-full max-w-xs"
                id="select-user"
              >
                <!-- NEED TO FILL -->
              </select>
            </div>
          </form>

          <div class="mt-6 flex justify-evenly">
            <form method="dialog">
              <!-- if there is a button in form, it will close the modal -->
              <button class="btn">Close</button>
            </form>
            <button class="btn btn-success">Save</button>
          </div>
        </div>
      </dialog>
    </div>
  </div>
</template>
