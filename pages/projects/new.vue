<template>
  <div class="w-full max-w-md p-2">
    <h1 id="main-title" class="text-xl font-bold">Add Project</h1>
    <form class="mt-4 flex flex-col gap-4" onsubmit="event.preventDefault()">
      <div>
        <label for="title" class="label">Title</label>
        <input
          id="title"
          type="text"
          class="input input-bordered w-full"
          placeholder="Title"
        />
      </div>

      <div>
        <label for="description" class="label">Description</label>
        <textarea
          id="description"
          class="textarea textarea-bordered w-full"
          placeholder="Description"
        ></textarea>
      </div>

      <div class="flex flex-col gap-2">
        <div class="font-lg font-bold">Guests</div>
        <div id="guest-list" class="flex flex-col gap-2"></div>

        <div class="flex justify-between gap-2">
          <input
            id="guest"
            type="text"
            class="input input-bordered w-full"
            placeholder="Guest"
          />
          <button id="add-guest" class="btn btn-outline btn-info">Add</button>
        </div>
      </div>

      <div id="error" class="text-error"></div>

      <div class="flex justify-evenly gap-2">
        <NuxtLink to="/projects" class="btn btn-neutral w-2/5">Close</NuxtLink>
        <button id="btn-save" class="btn btn-success w-2/5">Save</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="js">
definePageMeta({
  layout: 'navbar'
})

const { $toast } = useNuxtApp()
const query = useRoute().query
let editing = false
if (query.edit !== undefined) {
  editing = true
}

const { data: _users } = await useFetch('/api/users')
const me = await getME()

// In order to simulate a real script, we need to write everything inside the
// `onMounted` hook. Outside the onMounted everything is executed before the
// template is loaded.
onMounted(async () => {
  let guests = []

  if (editing) {
    document.getElementById('main-title').innerHTML = 'Edit Project'

    try {
      const res = await fetch(`/api/projects/${query.id}`)

      if (!res.ok) {
        throw new Error('Failed to load project')
      }

      const project = await res.json()

      document.getElementById('title').value = project.title
      document.getElementById('description').value = project.description

      if (!project.guests) {
        project.guests = { waiting: [], accepted: [] }
      }

      for (const g in project.guests.waiting) {
        guests.push(project.guests.waiting[g].username)
      }

      for (const g in project.guests.accepted) {
        guests.push(project.guests.accepted[g].username)
      }

      console.log('project: ', project)
    } catch (error) {
      console.error(error)
      $toast.error('Could not load project')
    }
  } else {
    document.getElementById('main-title').innerHTML = 'Add Project'
  }

  // ------ Add guest ------

  function addGuest() {
    const guest = document.getElementById('guest').value
    if (guest.trim() === '') {
      return
    }

    if (!_users.value) {
      $toast.error('User not found')
      return
    }

    const user = _users.value.filter((u) => u.username === guest)[0]
    if (!user) {
      $toast.error('User not found')
      return
    }

    if (guests.includes(user.username)) {
      $toast.error('Username already added')
      return
    }

    if (user.username === me.username) {
      $toast.error('You cannot add yourself')
      return
    }

    guests.push(guest)
    listGuests()
    document.getElementById('guest').value = ''
  }

  document.getElementById('add-guest').addEventListener('click', addGuest)

  function deleteGuest(guest) {
    guests = guests.filter((g) => g !== guest)
    listGuests()
  }

  function listGuests() {
    const el_glist = document.getElementById('guest-list')
    if (guests.length == 0) {
      el_glist.innerHTML = 'No guests'
      return
    }

    el_glist.innerHTML = ''
    for (const g in guests) {
      const guest = guests[g]
      const el = document.createElement('div')
      el.innerHTML = `
        <div class="flex justify-between">
          <div class="flex items-center">${guest}</div>
          <button id="delete-${guest}" class="btn btn-outline btn-error btn-sm md:btn-md">
            Delete
          </button>
        </div>
      `
      document.getElementById('guest-list').appendChild(el)
      document
        .getElementById(`delete-${guest}`)
        .addEventListener('click', () => deleteGuest(guest))
    }
  }
  listGuests()

  // ------ Set error ------

  let error = ''
  function showError(msg) {
    error = msg
    document.getElementById('error').innerHTML = error
  }

  // ------ Save project ------

  async function save() {
    const title = document.getElementById('title').value
    console.log('title: ', title)

    if (title.trim() === '') {
      error = 'ERROR: Title is required'
      showError(error)
      return
    }

    const description = document.getElementById('description').value
    console.log('description: ', description)

    if (description.trim() === '') {
      error = 'ERROR: Description is required'
      showError(error)
      return
    }

    try {
      const res = await fetch(`/api/projects${editing ? `/${query.id}` : ''}`, {
        method: editing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description,
          guests
        })
      })

      if (!res.ok) {
        throw new Error('Failed to save project')
      }

      //window.location.href = '/projects'
      // To avoid reloading the all page
      useRouter().push('/projects')
    } catch (error) {
      console.error(error)
      $toast.error('Could not save project')
    }
  }

  document.getElementById('btn-save').addEventListener('click', save)
})
</script>
