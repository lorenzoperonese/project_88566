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

  function displayTasks() {
    const tasksEl = document.getElementById('tasks-list')

    // Clean up content
    while (tasksEl.firstChild) {
      tasksEl.removeChild(tasksEl.firstChild)
    }

    if (tasks.length === 0) {
      const noTasksText = document.createTextNode('No tasks')
      tasksEl.appendChild(noTasksText)
      return
    }

    tasks.forEach((task) => {
      const taskDiv = document.createElement('div')
      taskDiv.textContent = task.title
      tasksEl.appendChild(taskDiv)
    })

    // Header

    let min = new Date(Math.min(...tasks.map((task) => task.start)))
    let max = new Date(Math.max(...tasks.map((task) => task.end)))

    const header = document.getElementById('tasks-header')

    while (header.firstChild) {
      header.removeChild(header.firstChild)
    }

    for (let i = new Date(min); i <= max; i.setDate(i.getDate() + 1)) {
      const day = document.createElement('div')
      day.classList.add('text-center')
      day.textContent = `${i.getDate()}-${i.getMonth()}-${i.getFullYear()}`
      header.appendChild(day)
    }

    // Grid
    const tasksGrid = document.getElementById('tasks-grid')

    // Clean up grid
    while (tasksGrid.firstChild) {
      tasksGrid.removeChild(tasksGrid.firstChild)
    }

    const createTaskGrid = (task) => {
      const taskDiv = document.createElement('div')
      taskDiv.classList.add('flex')

      const start = new Date(task.start)
      const end = new Date(task.end)

      for (let i = new Date(min); i <= max; i.setDate(i.getDate() + 1)) {
        const day = document.createElement('div')
        day.classList.add('text-center')
        day.classList.add('w-96')
        day.classList.add('h-4')

        if (i >= start && i <= end) {
          day.classList.add('bg-primary')
        } else {
          day.classList.add('bg-base-300')
        }

        taskDiv.appendChild(day)
      }

      console.log('taskDiv: ', taskDiv)

      return taskDiv
    }

    tasks.forEach((task) => {
      tasksGrid.appendChild(createTaskGrid(task))
    })
  }

  await fetchProject()
  displayProject()
  await fetchTasks()
  displayTasks()
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
    let select = document.getElementById('task-modal-select-user')
    let users = await allUsers()

    select.innerHTML = users
      .map((user) => {
        return `<option value="${user.id}">${user.name}</option>`
      })
      .join('')

    if (users.length === 1) {
      select.disabled = true
    }
  }

  function insertTasksIntoSelect() {
    const select = document.getElementById('task-modal-select-depends')

    // Reset select content
    select.innerHTML = ''

    const defaultOption = document.createElement('option')
    defaultOption.value = ''
    defaultOption.textContent = 'No tasks yet'
    select.appendChild(defaultOption)

    if (tasks.length === 0) {
      select.disabled = true
      return
    }

    // Add all task options
    tasks.forEach((task) => {
      const option = document.createElement('option')
      option.value = task.id
      option.textContent = task.title
      select.appendChild(option)
    })
  }

  insertTasksIntoSelect()
  inserUsersIntoSelect()

  async function addTask() {
    const title = document.getElementById('task-modal-title').value
    const description = document.getElementById('task-modal-description').value
    const phase = document.getElementById('task-modal-phase').value
    const state = document.getElementById('task-modal-state').value
    const start = document.getElementById('task-modal-start').value
    const end = document.getElementById('task-modal-end').value
    const depends = document.getElementById('task-modal-select-depends').value
    const user = document.getElementById('task-modal-select-user').value

    if (!title) {
      showError('Title is required')
      return
    }

    if (!description) {
      showError('Description is required')
      return
    }

    if (!start) {
      showError('Start date is required')
      return
    }

    if (!end) {
      showError('End date is required')
      return
    }

    if (!user) {
      showError('User is required')
      return
    }

    try {
      $fetch(`/api/projects-tasks/${$route.params.id}`, {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          phase,
          state,
          start: new Date(start).getTime(),
          end: new Date(end).getTime(),
          depends,
          user
        })
      })

      updateTasks()
      document.getElementById('task_modal').close()
    } catch (error) {
      console.error(error)
      showError('Could not add task')
    }
  }

  document.getElementById('task-modal-save').addEventListener('click', addTask)

  // ------ Utils ------
  async function updateTasks() {
    await fetchTasks()
    displayTasks()
    insertTasksIntoSelect()
  }
})
</script>

<template>
  <div class="flex flex-col gap-2 p-2">
    <h1 id="project-title" class="text-2xl font-bold"></h1>
    <p id="project-description" class=""></p>
    <div class="rounded bg-base-200 p-2">
      <div class="flex gap-2">
        <div class="flex flex-col">
          <h2 class="text-center text-lg font-bold">Tasks</h2>
          <div class="divider"></div>

          <div class="flex h-full flex-col justify-between">
            <div id="tasks-list" class="flex flex-col gap-2"></div>

            <button
              class="btn btn-outline btn-primary"
              onclick="task_modal.showModal()"
            >
              Add task
            </button>
          </div>
        </div>

        <div class="divider divider-horizontal h-96"></div>

        <div class="flex w-full flex-col overflow-x-auto">
          <div id="tasks-header" class="flex gap-4"></div>

          <div class="divider"></div>

          <div id="tasks-grid"></div>
        </div>
      </div>
    </div>

    <!--- Task modal --->
    <dialog id="task_modal" class="modal modal-bottom sm:modal-middle">
      <div class="modal-box">
        <h3 class="text-center text-lg font-bold">Add Task</h3>
        <form class="flex flex-col gap-2">
          <div class="form-control">
            <label for="task-modal-title">Title</label>
            <input
              id="task-modal-title"
              type="text"
              class="input input-bordered"
            />
          </div>

          <div class="form-control">
            <label for="task-modal-description">Description</label>
            <textarea
              id="task-modal-description"
              type="text"
              class="textarea textarea-bordered"
            ></textarea>
          </div>

          <div class="form-control">
            <label for="task-modal-phase">Phase</label>
            <input
              id="task-modal-phase"
              type="text"
              class="input input-bordered"
            />
          </div>

          <div class="form-control bordered">
            <label for="task-modal-state">State</label>
            <select
              class="select select-bordered w-full max-w-xs"
              id="task-modal-state"
            >
              <option value="todo">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
              <option value="abbandoned">Abbandoned</option>
            </select>
          </div>

          <div class="flex justify-between">
            <div class="flex gap-2">
              <label for="task-modal-start" class="flex items-center"
                >Start</label
              >
              <input
                id="task-modal-start"
                type="date"
                class="input input-bordered"
              />
            </div>

            <div class="flex gap-2">
              <label for="task-modal-end" class="flex items-center">End</label>
              <input
                id="task-modal-end"
                type="date"
                class="input input-bordered"
              />
            </div>
          </div>

          <div class="form-control bordered">
            <label for="task-modal-select-depends">Depends</label>
            <select
              class="select select-bordered w-full max-w-xs"
              id="task-modal-select-depends"
            >
              <!-- NEED TO FILL -->
            </select>
          </div>

          <div class="form-control bordered">
            <label for="task-modal-select-user">User</label>
            <select
              class="select select-bordered w-full max-w-xs"
              id="task-modal-select-user"
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
          <button class="btn btn-success" id="task-modal-save">Save</button>
        </div>
      </div>
    </dialog>
  </div>
</template>
