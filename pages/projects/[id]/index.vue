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
  const me = await getME()

  // ------ Error -----
  let error = ''
  function showError(msg) {
    error = msg
    $toast.error(error)
  }

  // ------ Project ------
  let project = {}

  let ganntView = true
  let dateOrder = true

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
  let tmpSubtasks = []

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
    const tasksLinear = document.getElementById('tasks-linear')

    // Clean up content
    while (tasksGrid.firstChild) {
      tasksGrid.removeChild(tasksGrid.firstChild)
    }

    while (tasksLinear.firstChild) {
      tasksLinear.removeChild(tasksLinear.firstChild)
    }

    // Header

    let min = new Date(Math.min(...tasks.map((task) => task.start)))
    let max = new Date(Math.max(...tasks.map((task) => task.end)))

    const nDays = (max - min) / (1000 * 60 * 60 * 24) + 1

    tasksGrid.style.gridTemplateColumns = `auto repeat(${nDays}, 1fr)`
    tasksGrid.style.gridTemplateRows = `auto`

    const emptyForGrid = document.createElement('div')
    emptyForGrid.classList.add('text-center')
    emptyForGrid.textContent = 'Tasks/Days'
    emptyForGrid.classList.add('text-gray-500')
    emptyForGrid.style.gridRow = '1 / 1'
    emptyForGrid.style.gridColumn = '1 / 1'
    tasksGrid.appendChild(emptyForGrid)

    const today = await getToday()

    for (let i = new Date(min); i <= max; i.setDate(i.getDate() + 1)) {
      const day = document.createElement('div')
      day.classList.add('justify-center')
      day.classList.add('flex')
      day.classList.add('items-center')
      day.classList.add('mx-2')

      if (isToday(today, i)) {
        day.classList.add('text-primary')
      }

      day.textContent = `${i.getDate()}-${i.getMonth() + 1}-${i.getFullYear()}`
      tasksGrid.appendChild(day)
    }

    // Grid

    let currentPhase = ''

    const sTasks = tasks.sort((a, b) => {
      if (ganntView) return a.phase < b.phase

      if (dateOrder) {
        return a.start - b.start
      } else {
        return a.user_id - b.user_id
      }
    })

    console.log('sorted tasks', sTasks)

    sTasks.forEach(async (task) => {
      // --- Grid ---
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

      // --- Linear ---
      const taskDiv2 = document.createElement('div')
      taskDiv2.classList.add('flex')
      taskDiv2.classList.add('flex-col')
      taskDiv2.classList.add('gap-2')
      taskDiv2.classList.add('min-w-40')
      taskDiv2.classList.add('w-full')
      taskDiv2.classList.add('w-max-xs')
      taskDiv2.classList.add('p-2')
      taskDiv2.classList.add('rounded-lg')
      taskDiv2.classList.add('hover:opacity-90')

      const taskDiv2Title = document.createElement('div')
      taskDiv2Title.textContent = task.title
      taskDiv2Title.classList.add('font-bold')
      taskDiv2Title.classList.add('text-lg')
      taskDiv2.appendChild(taskDiv2Title)

      const taksDiv2Description = document.createElement('div')
      taksDiv2Description.textContent =
        task.description.length > 253
          ? task.description.substring(0, 250) + '...'
          : task.description
      taskDiv2.appendChild(taksDiv2Description)

      const taskDiv2Person = document.createElement('div')
      let __users = await allUsers()
      taskDiv2Person.textContent = __users.find(
        (user) => user.id === task.user_id
      ).name
      taskDiv2Person.classList.add('font-bold')
      taskDiv2.appendChild(taskDiv2Person)

      const taskDiv2Period = document.createElement('div')
      taskDiv2Period.textContent = `${start.getDate()}-${start.getMonth() + 1}-${start.getFullYear()} to ${end.getDate()}-${end.getMonth() + 1}-${end.getFullYear()}`
      taskDiv2Period.classList.add('italic')
      taskDiv2.appendChild(taskDiv2Period)

      switch (task.state) {
        case 'unavailable':
          taskDiv2.classList.add('color-unavailable')
          break
        case 'todo':
          taskDiv2.classList.add('color-todo')
          break
        case 'in_progress':
          taskDiv2.classList.add('color-in_progress')
          break
        case 'done':
          taskDiv2.classList.add('color-done')
          break
        case 'reactivated':
          taskDiv2.classList.add('color-reactivated')
          break
        case 'late':
          taskDiv2.classList.add('color-late')
          break
        case 'abbandoned':
          taskDiv2.classList.add('color-abbandoned')
          break
      }

      taskDiv2.addEventListener('click', () => editTask(task.id))

      tasksLinear.appendChild(taskDiv2)
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
    console.log('Saving task')
    const title = document.getElementById('task-modal-title').value
    let description = document.getElementById('task-modal-description').value
    const phase = document.getElementById('task-modal-phase').value
    const state = document.getElementById('task-modal-state').value
    const start = document.getElementById('task-modal-start').value
    const end = document.getElementById('task-modal-end').value
    let input = document.getElementById('task-modal-input').value
    let output = document.getElementById('task-modal-output').value
    console.log('Saving task 2')
    const dependency = document.getElementById(
      'task-modal-select-depends'
    ).value
    const translation = document.getElementById(
      'task-modal-select-translation'
    ).value
    const milestone = document.getElementById(
      'task-modal-checkbox-milestone'
    ).checked
    const subtasks = tmpSubtasks
    const user_id = document.getElementById('task-modal-select-user').value

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

    if (!input) {
      showError('Input is required')
      return
    }

    if (!output) {
      showError('Output is required')
      return
    }

    if (!user_id) {
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
      await $fetch(`/api/projects-tasks/${$route.params.id}`, {
        method: addingTask ? 'POST' : 'PUT',
        body: JSON.stringify({
          id: taskID,
          title,
          description,
          phase,
          state,
          start: new Date(start).getTime(),
          end: new Date(end).getTime(),
          input,
          output,
          translation: translation === 'true',
          milestone,
          dependency,
          subtasks,
          user_id
        })
      })

      document.getElementById('task_modal').close()
      await updateTasks()
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
    if (t.user_id === me.id || me.id == project.user_id) {
      document.getElementById('task-modal-state').disabled = false
    } else {
      document.getElementById('task-modal-state').disabled = true
    }
    document.getElementById('task-modal-state').value = t.state
    document.getElementById('task-modal-start').value = new Date(t.start)
      .toISOString()
      .split('T')[0]
    document.getElementById('task-modal-end').value = new Date(t.end)
      .toISOString()
      .split('T')[0]
    document.getElementById('task-modal-input').value = t.input
    document.getElementById('task-modal-output').value = t.output
    document.getElementById('task-modal-select-depends').value = t.dependency
      ? t.dependency
      : ''
    document.getElementById('task-modal-select-translation').value =
      t.translation ? 'true' : 'false'

    if (me.id !== project.user_id) {
      document.getElementById('task-modal-select-translation').disabled = true
    } else {
      document.getElementById('task-modal-select-translation').disabled =
        t.milestone
    }
    document.getElementById('task-modal-checkbox-milestone').checked =
      t.milestone
    document.getElementById('task-modal-select-user').value = t.user_id
    tmpSubtasks = t.subtasks

    if (t.user_id === me.id || me.id == project.user_id) {
      displaySubtasks(false)
      document
        .getElementById('task-modal-subtasks-adder')
        .classList.remove('invisible')
    } else {
      displaySubtasks(true)
      document
        .getElementById('task-modal-subtasks-adder')
        .classList.add('invisible')
    }

    document.getElementById('task_modal').showModal()
    addingTask = false
    taskID = id

    if (me.id === project.user_id) {
      document.getElementById('task-modal-delete').classList.remove('invisible')
    }

    if (me.id === project.user_id || me.id === t.user_id) {
      document.getElementById('task-modal-save').classList.remove('invisible')
    }
  }

  function displaySubtasks(disabled = false) {
    document.getElementById('task-modal-subtasks-list').innerHTML = ''

    for (const t of tmpSubtasks) {
      let div = document.createElement('div')
      div.innerHTML = `
        <div class="flex gap-2 justify-between">
          <div>
            ${t.title}
          </div>
          <input type="checkbox" ${t.done ? 'checked' : ''} class="checkbox checkbox-sm md:checkbox-md" ${disabled ? 'disabled' : ''} />
          <button class="btn btn-error btn-sm ${disabled ? 'invisible' : ''}">Delete</button>
        </div>
      `
      div.getElementsByTagName('button')[0].addEventListener('click', () => {
        console.log('Deleted subtask', t)
        tmpSubtasks = tmpSubtasks.filter((subtask) => subtask !== t)
        div.remove()
      })
      div.getElementsByTagName('input')[0].addEventListener('change', (e) => {
        const indx = tmpSubtasks.findIndex((e) => e === t)
        if (indx !== -1) {
          tmpSubtasks[indx].done = !tmpSubtasks[indx].done
        }
      })

      document.getElementById('task-modal-subtasks-list').appendChild(div)
    }
  }

  function addTask() {
    addingTask = true
    taskID = null
    document.getElementById('task-modal-delete').classList.add('invisible')
    document.getElementById('task-modal-title').value = ''
    document.getElementById('task-modal-description').value = ''
    document.getElementById('task-modal-phase').value = ''
    document.getElementById('task-modal-state').value = 'todo'
    document.getElementById('task-modal-start').value = ''
    document.getElementById('task-modal-end').value = ''
    document.getElementById('task-modal-input').value = ''
    document.getElementById('task-modal-output').value = ''
    document.getElementById('task-modal-select-depends').value = ''
    document.getElementById('task-modal-select-translation').value = 'false'
    if (me.id !== project.user_id) {
      document.getElementById('task-modal-select-translation').disabled = true
    } else {
      document.getElementById('task-modal-select-translation').disabled = false
    }
    document.getElementById('task-modal-checkbox-milestone').checked = false
    document.getElementById('task_modal').showModal()
  }
  document.getElementById('btn-add-task').addEventListener('click', addTask)
  document.getElementById('task-modal-save').classList.remove('invisible')

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

  // Force task to have input equal to output of dependency
  document
    .getElementById('task-modal-select-depends')
    .addEventListener('change', async (e) => {
      const dependency = e.target.value
      const task = tasks.find((task) => task.id === dependency)

      if (task) {
        document.getElementById('task-modal-input').value = task.output
        document.getElementById('task-modal-input').disabled = true
      } else {
        document.getElementById('task-modal-input').disabled = false
        document.getElementById('task-modal-input').value = ''
      }
    })

  // Force milestones to be contracted
  document
    .getElementById('task-modal-checkbox-milestone')
    .addEventListener('change', async (e) => {
      const milestone = e.target.checked
      if (milestone) {
        document.getElementById('task-modal-select-translation').value = 'false'
        document.getElementById('task-modal-select-translation').disabled = true
      } else {
        if (me.id === project.user_id) {
          document.getElementById('task-modal-select-translation').disabled =
            false
        }
      }
    })

  // Add subtask
  function addSubtask() {
    const input = document.getElementById('task-modal-subtasks-input')
    const title = input.value
    const sb = {
      title,
      done: false
    }

    tmpSubtasks.push(sb)
    displaySubtasks()
    input.value = ''
  }

  document
    .getElementById('btn-add-subtask')
    .addEventListener('click', addSubtask)

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
      div.classList.add('md:text-base')
      div.classList.add('text-sm')
      div.textContent = (
        state.charAt(0).toUpperCase() + state.slice(1)
      ).replace('_', ' ')
      el.appendChild(div)
    }
  }
  insetColorLegend()

  // Change view mode between Gannt and Linear
  document
    .getElementById('select-gannt-linear')
    .addEventListener('change', (e) => {
      const mode = e.target.value

      if (mode === 'gannt') {
        document.getElementById('view-linear').classList.add('hidden')
        document.getElementById('view-gannt').classList.remove('hidden')
        document.getElementById('select-linear-order').classList.add('hidden')
        ganntView = true
      } else {
        document.getElementById('view-linear').classList.remove('hidden')
        document.getElementById('view-gannt').classList.add('hidden')
        document
          .getElementById('select-linear-order')
          .classList.remove('hidden')
        ganntView = false
      }
    })

  // Change order of tasks in Linear view
  document
    .getElementById('select-linear-order')
    .addEventListener('change', (e) => {
      const order = e.target.value
      const tasksLinear = document.getElementById('tasks-linear')

      if (order === 'date') {
        dateOrder = true
      } else {
        dateOrder = false
      }

      displayTasks()
    })

  // If not the project owner
  if (me.id !== project.user_id) {
    // Hide add task button
    document.getElementById('btn-add-task').classList.add('invisible')

    document.getElementById('task-modal-title').disabled = true
    document.getElementById('task-modal-description').disabled = true
    document.getElementById('task-modal-phase').disabled = true
    document.getElementById('task-modal-start').disabled = true
    document.getElementById('task-modal-end').disabled = true
    document.getElementById('task-modal-input').disabled = true
    document.getElementById('task-modal-output').disabled = true
    document.getElementById('task-modal-select-depends').disabled = true
    document.getElementById('task-modal-select-translation').disabled = true
    document.getElementById('task-modal-checkbox-milestone').disabled = true
    document.getElementById('task-modal-select-user').disabled = true

    document.getElementById('task-modal-delete').classList.add('invisible')
  }
})

// This is an ugly trick to only use JS in projects and to avoid reinventing the
// wheel with the TimeMachine
function dispatchEvent() {
  document.getElementById('projects-tm-btn').dispatchEvent(new Event('update'))
}
</script>

<template>
  <div
    class="flex flex-col gap-2 overflow-y-auto p-2"
    style="height: calc(100vh - var(--navbar-height))"
  >
    <div class="flex justify-between">
      <div>
        <h1 id="project-title" class="text-2xl font-bold"></h1>
        <p id="project-description" class=""></p>
      </div>

      <div class="flex flex-col gap-2 md:flex-row">
        <div class="form-control bordered invisible" id="select-linear-order">
          <select class="select select-bordered w-full max-w-xs">
            <option value="date">Date</option>
            <option value="person">Person</option>
          </select>
        </div>

        <div class="form-control bordered">
          <select
            class="select select-bordered w-full max-w-xs"
            id="select-gannt-linear"
          >
            <option value="gannt">Gannt</option>
            <option value="linear">Linear</option>
          </select>
        </div>
      </div>
    </div>

    <div class="rounded bg-base-200 p-2">
      <div id="view-gannt">
        <div class="grid gap-1 overflow-x-auto" id="tasks-grid"></div>
      </div>

      <div id="view-linear" class="hidden">
        <div
          class="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5"
          id="tasks-linear"
        ></div>
      </div>

      <div class="mt-5 flex flex-col justify-between gap-4 md:flex-row">
        <button
          class="btn btn-outline btn-primary btn-sm md:btn-md"
          id="btn-add-task"
        >
          Add task
        </button>

        <div
          id="color-legend"
          class="grid grid-cols-2 gap-2 md:grid-cols-7"
        ></div>
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
              class="input input-sm input-bordered md:input-md"
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
              class="textarea textarea-bordered textarea-sm md:textarea-md"
            ></textarea>
          </div>

          <div class="form-control">
            <div class="label">
              <label for="task-modal-phase" class="label-text">Phase</label>
            </div>
            <input
              id="task-modal-phase"
              type="text"
              class="input input-sm input-bordered md:input-md"
            />
          </div>

          <div class="form-control bordered">
            <div class="label">
              <label for="task-modal-state" class="label-text">State</label>
            </div>
            <select
              class="select select-bordered select-sm w-full max-w-xs md:select-md"
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

          <div class="flex flex-col justify-between gap-2 md:flex-row">
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
                class="input input-sm input-bordered w-full md:input-md md:w-auto"
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
                class="input input-sm input-bordered w-full md:input-md md:w-auto"
              />
            </div>
          </div>

          <div class="form-control">
            <div class="label">
              <label for="task-modal-input" class="label-text">Input</label>
            </div>
            <input
              id="task-modal-input"
              type="text"
              class="input input-sm input-bordered md:input-md"
            />
          </div>

          <div class="form-control">
            <div class="label">
              <label for="task-modal-output" class="label-text">Output</label>
            </div>
            <input
              id="task-modal-output"
              type="text"
              class="input input-sm input-bordered md:input-md"
            />
          </div>

          <div class="form-control bordered">
            <div class="label">
              <label for="task-modal-select-depends" class="label-text"
                >Depends</label
              >
            </div>
            <select
              class="select select-bordered select-sm w-full max-w-xs md:select-md"
              id="task-modal-select-depends"
            >
              <!-- NEED TO FILL -->
            </select>
          </div>

          <div class="form-control bordered">
            <div class="label">
              <label for="" class="label-text">Settings</label>
            </div>
            <div class="flex justify-between">
              <select
                class="select select-bordered select-sm w-full max-w-xs md:select-md"
                id="task-modal-select-translation"
              >
                <option value="true">Translation</option>
                <option value="false">Contractions</option>
              </select>

              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text mr-4">Milestone</span>
                  <input
                    type="checkbox"
                    class="checkbox checkbox-sm md:checkbox-md"
                    id="task-modal-checkbox-milestone"
                  />
                </label>
              </div>
            </div>
          </div>

          <div class="form-control bordered">
            <div class="label">
              <label for="task-modal-select-user" class="label-text"
                >User</label
              >
            </div>
            <select
              class="select select-bordered select-sm w-full max-w-xs md:select-md"
              id="task-modal-select-user"
            >
              <!-- NEED TO FILL -->
            </select>
          </div>

          <div class="divider"></div>

          <div class="form-control">
            <div class="label">
              <label class="label-text">SubTasks</label>
            </div>
            <div
              id="task-modal-subtasks-list"
              class="flex flex-col gap-2"
            ></div>
            <div
              class="mt-2 flex justify-between gap-2"
              id="task-modal-subtasks-adder"
            >
              <input
                type="text"
                placeholder="Subtask..."
                class="input input-sm input-bordered flex-1 text-sm md:input-md placeholder:text-gray-600"
                id="task-modal-subtasks-input"
              />
              <button
                class="btn btn-primary btn-sm md:btn-md"
                type="button"
                id="btn-add-subtask"
              >
                Add subtask task
              </button>
            </div>
          </div>
        </form>

        <div class="mt-6 flex justify-evenly">
          <form method="dialog">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn btn-sm md:btn-md">Close</button>
          </form>
          <button
            class="btn btn-error btn-sm invisible md:btn-md"
            id="task-modal-delete"
          >
            Delete
          </button>
          <button
            class="btn btn-success btn-sm invisible md:btn-md"
            id="task-modal-save"
          >
            Save
          </button>
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
