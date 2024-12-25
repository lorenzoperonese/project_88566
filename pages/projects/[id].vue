<script setup lang="js">
definePageMeta({
  layout: 'navbar'
})

const $route = useRoute()
const { $toast } = useNuxtApp()

const taskStates = [
  'unavailable',
  'todo',
  'in_progress',
  'done',
  'reactivated',
  'late',
  'abbandoned'
]

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

  async function displayTasks() {
    const tasksGrid = document.getElementById('tasks-grid')

    // Clean up content
    while (tasksGrid.firstChild) {
      tasksGrid.removeChild(tasksGrid.firstChild)
    }

    //if (tasks.length === 0) {
    //  const noTasksText = document.createTextNode('No tasks')
    //  tasksGrid.appendChild(noTasksText)
    //}

    // Header

    let min = new Date(Math.min(...tasks.map((task) => task.start)))
    let max = new Date(Math.max(...tasks.map((task) => task.end)))

    const nYears = max.getFullYear() - min.getFullYear() + 1
    const nMonths = (max.getMonth() - min.getMonth() + 13) % 12
    const nDays = (max - min) / (1000 * 60 * 60 * 24) + 1

    tasksGrid.style.gridTemplateColumns = `auto repeat(${nDays}, 1fr)`
    tasksGrid.style.gridTemplateRows = `auto`

    const empty = document.createElement('div')
    empty.classList.add('text-center')
    empty.textContent = 'Tasks/Days'
    empty.classList.add('text-gray-500')
    empty.style.gridRow = '1 / 1'
    empty.style.gridColumn = '1 / 1'
    tasksGrid.appendChild(empty)

    //for (let i = 0; i < nMonths; i++) {
    //  const month = document.createElement('div')
    //  month.classList.add('text-center')
    //  month.textContent = `${min.getMonth() + i}`
    //  month.style.gridRow = '1 / 1'
    //  month.style.gridColumn = `${(nDays / nMonths) * i + 2} / ${nDays / nMonths}`
    //  tasksGrid.appendChild(month)
    //}

    //const years = document.createElement('div')
    //years.classList.add('text-center')
    //years.style.gridRow = '1 / 1'
    //years.style.gridColumn = `2 / ${nDays + 2}`
    //years.textContent = '2024'
    //tasksGrid.appendChild(years)

    const today = await getToday()

    for (let i = new Date(min); i <= max; i.setDate(i.getDate() + 1)) {
      const day = document.createElement('div')
      day.classList.add('justify-center')
      day.classList.add('flex')
      day.classList.add('items-center')
      day.classList.add('mx-2')

      if (isToday2(today, i)) {
        day.classList.add('text-primary')
      }

      day.textContent = `${i.getDate()}-${i.getMonth() + 1}-${i.getFullYear()}`
      tasksGrid.appendChild(day)
    }

    // Grid

    let currentPhase = ''

    const sTasks = tasks.sort((a, b) => {
      return a.phase < b.phase
    })

    console.log('sorted tasks', sTasks)

    sTasks.forEach((task) => {
      if (currentPhase !== task.phase) {
        currentPhase = task.phase

        const phaseDiv = document.createElement('div')
        phaseDiv.textContent = task.phase
        phaseDiv.classList.add('flex')
        phaseDiv.classList.add('items-center')
        phaseDiv.classList.add('grid-phase')
        tasksGrid.appendChild(phaseDiv)
      }

      const taskDiv = document.createElement('div')
      taskDiv.textContent = task.title
      taskDiv.classList.add('text-center')
      taskDiv.classList.add('flex')
      taskDiv.classList.add('items-center')
      taskDiv.classList.add('hover:bg-base-100')
      taskDiv.classList.add('p-2')
      taskDiv.classList.add('min-w-40')
      taskDiv.style.gridColumn = '1 / 1'
      taskDiv.addEventListener('click', () => editTask(task.id))
      tasksGrid.appendChild(taskDiv)

      const start = new Date(task.start)
      const end = new Date(task.end)

      for (let i = new Date(min); i <= max; i.setDate(i.getDate() + 1)) {
        const day = document.createElement('div')
        day.classList.add('text-center')
        //day.classList.add('w-96')
        //day.classList.add('h-4')
        day.classList.add('grid-item')

        if (i.getTime() < today.getTime()) {
          day.classList.add('opacity-50')
        }

        if (i >= start && i <= end) {
          if (taskStates.includes(task.state)) {
            day.classList.add(`color-${task.state}`)
          } else {
            day.classList.add('bg-base-300')
          }
        } else {
          day.classList.add('bg-base-300')
        }

        tasksGrid.appendChild(day)
      }
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

  // This variable is used to remember if the modal is adding a new task
  // or changing an existing one
  let addingTask = true
  let taskID = null

  async function saveTask() {
    const title = document.getElementById('task-modal-title').value
    const description = document.getElementById('task-modal-description').value
    const phase = document.getElementById('task-modal-phase').value
    const state = document.getElementById('task-modal-state').value
    const start = document.getElementById('task-modal-start').value
    const end = document.getElementById('task-modal-end').value
    const dependency = document.getElementById(
      'task-modal-select-depends'
    ).value
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

    if (new Date(start) > new Date(end)) {
      showError('Start date must be before end date')
      return
    }

    if (dependency !== undefined) {
      const t = tasks.find((task) => task.id === dependency)
      if (t && t.state !== 'done' && t.state !== 'abbandoned') {
        if (state !== 'unavailable') {
          //showError('Task state must be unavailable if it depends on another task that is not done or abbandoned')
          showError('State invalid')
          return
        }
      }
    }

    try {
      $fetch(`/api/projects-tasks/${$route.params.id}`, {
        method: addingTask ? 'POST' : 'PUT',
        body: JSON.stringify({
          id: taskID,
          title,
          description,
          phase,
          state,
          start: new Date(start).getTime(),
          end: new Date(end).getTime(),
          dependency,
          user
        })
      })

      updateTasks()
      document.getElementById('task_modal').close()
      addingTask = true
    } catch (error) {
      console.error(error)
      showError('Could not add task')
    }
  }

  document.getElementById('task-modal-save').addEventListener('click', saveTask)

  // ------ Edit Task modal ------
  function editTask(id) {
    let t = tasks.find((task) => task.id === id)
    console.log('Want to edit', t)

    document.getElementById('task-modal-title').value = t.title
    document.getElementById('task-modal-description').value = t.description
    document.getElementById('task-modal-phase').value = t.phase
    document.getElementById('task-modal-state').value = t.state
    document.getElementById('task-modal-start').value = new Date(t.start)
      .toISOString()
      .split('T')[0]
    document.getElementById('task-modal-end').value = new Date(t.end)
      .toISOString()
      .split('T')[0]
    document.getElementById('task-modal-select-depends').value = t.dependency
      ? t.dependency
      : ''
    document.getElementById('task-modal-select-user').value = t.user_id

    document.getElementById('task_modal').showModal()
    addingTask = false
    taskID = id
    document.getElementById('task-modal-delete').classList.remove('hidden')
  }

  function addTask() {
    addingTask = true
    taskID = null
    document.getElementById('task-modal-delete').classList.add('hidden')
    document.getElementById('task-modal-title').value = ''
    document.getElementById('task-modal-description').value = ''
    document.getElementById('task-modal-phase').value = ''
    document.getElementById('task-modal-state').value = 'todo'
    document.getElementById('task-modal-start').value = ''
    document.getElementById('task-modal-end').value = ''
    document.getElementById('task-modal-select-depends').value = ''
    document.getElementById('task_modal').showModal()
  }
  document.getElementById('btn-add-task').addEventListener('click', addTask)

  async function deleteTask() {
    try {
      $fetch(`/api/projects-tasks/${$route.params.id}`, {
        method: 'DELETE',
        body: JSON.stringify({
          id: taskID
        })
      })

      await updateTasks()
      document.getElementById('task_modal').close()
      addingTask = true
    } catch (error) {
      console.error(error)
      showError('Could not delete task')
    }
  }

  document
    .getElementById('task-modal-delete')
    .addEventListener('click', deleteTask)

  // ------ Utils ------
  async function updateTasks() {
    await fetchTasks()
    displayTasks()
    insertTasksIntoSelect()
  }

  document.getElementById('projects-tm-btn').addEventListener('update', () => {
    updateTasks()
  })

  function insetColorLegend() {
    const el = document.getElementById('color-legend')
    for (let state of taskStates) {
      const div = document.createElement('div')
      div.classList.add('flex')
      div.classList.add('items-center')
      div.classList.add('justify-center')
      div.classList.add('p-2')
      div.classList.add('rounded-lg')
      div.classList.add(`color-${state}`)
      div.classList.add('w-40')
      div.textContent = state
      el.appendChild(div)
    }
  }
  insetColorLegend()
})

// This is an ugly trick to only use JS in projects and to avoid reinventing the
// wheel with the TimeMachine
function dispatchEvent() {
  document.getElementById('projects-tm-btn').dispatchEvent(new Event('update'))
}
</script>

<template>
  <div class="flex flex-col gap-2 p-2">
    <h1 id="project-title" class="text-2xl font-bold"></h1>
    <p id="project-description" class=""></p>
    <div class="rounded bg-base-200 p-2">
      <div class="grid gap-1 overflow-x-auto" id="tasks-grid"></div>

      <div class="mt-5 flex justify-between">
        <button class="btn btn-outline btn-primary" id="btn-add-task">
          Add task
        </button>

        <div id="color-legend" class="flex gap-2"></div>
      </div>
    </div>

    <!--- Task modal --->
    <dialog id="task_modal" class="modal modal-bottom sm:modal-middle">
      <div class="modal-box">
        <h3 class="text-center text-lg font-bold">Add Task</h3>
        <form class="flex flex-col gap-2">
          <div class="form-control">
            <div class="label">
              <label for="task-modal-title" class="label-text">Title</label>
            </div>
            <input
              id="task-modal-title"
              type="text"
              class="input input-bordered"
            />
          </div>

          <div class="form-control">
            <div class="label">
              <label for="task-modal-description" class="label-text"
                >Description</label
              >
            </div>
            <textarea
              id="task-modal-description"
              type="text"
              class="textarea textarea-bordered"
            ></textarea>
          </div>

          <div class="form-control">
            <div class="label">
              <label for="task-modal-phase" class="label-text">Phase</label>
            </div>
            <input
              id="task-modal-phase"
              type="text"
              class="input input-bordered"
            />
          </div>

          <div class="form-control bordered">
            <div class="label">
              <label for="task-modal-state" class="label-text">State</label>
            </div>
            <select
              class="select select-bordered w-full max-w-xs"
              id="task-modal-state"
            >
              <option value="unavailable">Unavailable</option>
              <option value="todo">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
              <option value="reactivated">Reactivated</option>
              <option value="late">Late</option>
              <option value="abbandoned">Abbandoned</option>
            </select>
          </div>

          <div class="flex justify-between">
            <div class="flex gap-2">
              <div class="label">
                <label
                  for="task-modal-start"
                  class="label-text flex items-center"
                  >Start</label
                >
              </div>
              <input
                id="task-modal-start"
                type="date"
                class="input input-bordered"
              />
            </div>

            <div class="flex gap-2">
              <div class="label">
                <label for="task-modal-end" class="label-text flex items-center"
                  >End</label
                >
              </div>
              <input
                id="task-modal-end"
                type="date"
                class="input input-bordered"
              />
            </div>
          </div>

          <div class="form-control bordered">
            <div class="label">
              <label for="task-modal-select-depends" class="label-text"
                >Depends</label
              >
            </div>
            <select
              class="select select-bordered w-full max-w-xs"
              id="task-modal-select-depends"
            >
              <!-- NEED TO FILL -->
            </select>
          </div>

          <div class="form-control bordered">
            <div class="label">
              <label for="task-modal-select-user" class="label-text"
                >User</label
              >
            </div>
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
          <button class="btn btn-error hidden" id="task-modal-delete">
            Delete
          </button>
          <button class="btn btn-success" id="task-modal-save">Save</button>
        </div>
      </div>
    </dialog>

    <TmButton
      class="fixed bottom-4 left-4"
      @update="dispatchEvent()"
      id="projects-tm-btn"
    />
  </div>
</template>

<style>
.grid-phase {
  grid-column: 1 / span full;
  text-align: center;
}

.color-unavailable {
  @apply bg-gray-200;
  @apply text-gray-500;
}

.color-todo {
  @apply bg-warning;
  @apply text-warning-content;
}

.color-in_progress {
  @apply bg-info;
  @apply text-info-content;
}

.color-done {
  @apply bg-success;
  @apply text-success-content;
}

.color-reactivated {
  @apply bg-orange-500;
  @apply text-orange-100;
}

.color-late {
  @apply bg-error;
  @apply text-error-content;
}

.color-abbandoned {
  @apply bg-red-800;
  @apply text-red-100;
}
</style>
