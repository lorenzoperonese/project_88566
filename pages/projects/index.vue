<script setup lang="js">
definePageMeta({
  layout: 'navbar'
})

const { $toast } = useNuxtApp()
const $router = useRouter()

onMounted(async () => {
  // ---- Error ----

  function showError(err) {
    $toast.error(err)
  }

  // ---- Projects ----

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

  async function deleteProject(id) {
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' })

      if (!res.ok) {
        throw new Error('Failed to delete project')
      }

      await fetchProjects()
      listProjects()
    } catch (error) {
      console.error(error)
      showError('Could not delete project')
    }
  }

  function listProjects() {
    console.log('Listing projects')
    let el_plist = document.getElementById('project-list')
    if (projects.length == 0) {
      el_plist.innerHTML = 'No projects'
      return
    }

    el_plist.innerHTML = ''
    for (const p in projects) {
      let project = projects[p]
      let el = document.createElement('div')
      el.innerHTML = `
        <div class="card bg-base-200 shadow-lg">
          <div class="card-body">
            <div class="card-title">${project.title}</div>
            <div class="">${project.description}</div>
            <div class="card-actions justify-center">
              <button id="detail-${project.id}" class="btn btn-outline btn-secondary">
                Details
              </button>
              <button id="edit-${project.id}" class="btn btn-outline btn-info">
                Edit
              </button>
              <button id="delete-${project.id}" class="btn btn-outline btn-error">
                Delete
              </button>
            </div>
          </div>
        </div>
      `
      document.getElementById('project-list').appendChild(el)
      document
        .getElementById(`delete-${project.id}`)
        .addEventListener('click', () => deleteProject(project.id))

      // This could be a simple <a> tag, but it will realod the all page. We use
      // the Vue router instead.
      document
        .getElementById(`detail-${project.id}`)
        .addEventListener('click', () =>
          $router.push(`/projects/${project.id}`)
        )

      document
        .getElementById(`edit-${project.id}`)
        .addEventListener('click', () => editProject(project.id))
    }
  }

  async function updateProjects() {
    await fetchProjects()
    listProjects()
  }

  updateProjects()

  // ---- Edit Modal ----

  let projectID = null

  function editProject(id) {
    let p = projects.find((p) => p.id == id)
    document.getElementById('title').value = p.title
    document.getElementById('description').value = p.description

    projectID = id

    document.getElementById('edit_modal').showModal()
  }

  async function saveEdit() {
    let title = document.getElementById('title').value
    let description = document.getElementById('description').value

    if (!title || !description) {
      $toast.error('Title and description are required')
      return
    }

    let p = projects.find((p) => p.id == projectID)
    p.title = title
    p.description = description

    try {
      const res = await fetch(`/api/projects/${projectID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(p)
      })

      if (!res.ok) {
        throw new Error('Failed to save project')
      }

      document.getElementById('edit_modal').close()

      await updateProjects()
    } catch (error) {
      console.error(error)
      showError('Could not save project')
    }

    console.log('Saving edit', title, description)
  }

  document
    .getElementById('save-project-btn')
    .addEventListener('click', saveEdit)
})
</script>

<template>
  <div>
    <div id="project-list" class="flex gap-4 p-4"></div>

    <div class="fixed bottom-4 right-4">
      <NuxtLink to="/projects/new" class="btn btn-primary"> ADD </NuxtLink>
    </div>

    <dialog id="edit_modal" class="modal modal-bottom sm:modal-middle">
      <div class="modal-box">
        <h3 class="text-center text-2xl font-bold">Edit Project</h3>

        <form>
          <div class="form-control">
            <label class="label">
              <span class="label-text" for="title">Title</span>
            </label>
            <input
              type="text"
              placeholder="Title"
              id="title"
              class="input input-bordered"
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text" for="description">Description</span>
            </label>
            <textarea
              placeholder="Description"
              id="description"
              class="textarea textarea-bordered"
            ></textarea>
          </div>
        </form>

        <div class="modal-action flex justify-evenly">
          <form method="dialog">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn">Close</button>
          </form>
          <button class="btn btn-success" id="save-project-btn">Save</button>
        </div>
      </div>
    </dialog>
  </div>
</template>
