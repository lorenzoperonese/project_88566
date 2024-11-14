<template>
  <div class="p-2">
    <h1 class="text-xl font-bold">Add Project</h1>
    <form class="mt-4 flex flex-col gap-4" onsubmit="event.preventDefault()">
      <div>
        <label for="title" class="label">Title</label>
        <input
          type="text"
          id="title"
          class="input input-bordered"
          placeholder="Title"
        />
      </div>

      <div>
        <label for="description" class="label">Description</label>
        <textarea
          id="description"
          class="textarea textarea-bordered w-96"
          placeholder="Description"
        ></textarea>
      </div>

      <div class="flex w-96 flex-col gap-2">
        <div class="font-lg font-bold">Guests</div>
        <div id="guest-list" class="flex flex-col gap-2"></div>

        <div class="flex justify-between">
          <input
            type="text"
            id="guest"
            class="input input-bordered"
            placeholder="Guest"
          />
          <button id="add-guest" class="btn btn-outline btn-secondary">
            Add
          </button>
        </div>
      </div>

      <div id="error" class="text-error"></div>

      <button id="addProject" class="btn btn-primary">Save</button>
    </form>
  </div>
</template>

<script setup lang="js">
definePageMeta({
  layout: 'navbar'
})

const { $toast } = useNuxtApp()

// In order to simulate a real script, we need to write everything inside the
// `onMounted` hook. Outside the onMounted everything is executed before the
// template is loaded.
onMounted(async () => {
  // ------ Add guest ------

  let guests = []

  function addGuest() {
    let guest = document.getElementById('guest').value
    if (guest.trim() === '') {
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
    let el_glist = document.getElementById('guest-list')
    if (guests.length == 0) {
      el_glist.innerHTML = 'No guests'
      return
    }

    el_glist.innerHTML = ''
    for (const g in guests) {
      let guest = guests[g]
      let el = document.createElement('div')
      el.innerHTML = `
        <div class="flex justify-between">
          <div class="flex items-center">${guest}</div>
          <button id="delete-${guest}" class="btn btn-outline btn-error">
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
    document.getElementById('error').innerHTML = error
  }

  // ------ Save project ------

  async function save() {
    let title = document.getElementById('title').value
    console.log('title: ', title)

    if (title.trim() === '') {
      error = 'ERROR: Title is required'
      showError(error)
      return
    }

    let description = document.getElementById('description').value
    console.log('description: ', description)

    if (description.trim() === '') {
      error = 'ERROR: Description is required'
      showError(error)
      return
    }

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
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

  document.getElementById('addProject').addEventListener('click', save)
})
</script>
