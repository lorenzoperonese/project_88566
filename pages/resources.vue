<script setup lang="ts">
definePageMeta({
  layout: 'navbar'
})

const { data: resourcesList } = await useFetch<ResourceList[]>(
  '/api/resources-list'
)

const newResource = ref('')

async function fetchResources() {
  const tmp = (await $fetch('/api/resources-list')) as any
  if (!tmp) {
    return
  }
  resourcesList.value = tmp as ResourceList[]
}

const addResource = async () => {
  if (!newResource.value) {
    return
  }

  await $fetch('/api/resources-list', {
    method: 'POST',
    body: JSON.stringify({ name: newResource.value })
  })

  newResource.value = ''
  fetchResources()
}

async function deleteResource(id: string) {
  await $fetch(`/api/resources-list/${id}`, {
    method: 'DELETE'
  })

  fetchResources()
}
</script>

<template>
  <div class="p-2">
    <h1 class="text-2xl font-bold">Resources</h1>

    <div class="mt-4">
      <ul class="list-disc gap-4 space-y-4">
        <li
          v-for="r in resourcesList"
          class="flex w-full max-w-sm justify-between gap-2"
        >
          <div>{{ r.name }}</div>
          <button class="btn btn-error btn-sm" @click="deleteResource(r.id)">
            Delete
          </button>
        </li>
      </ul>
    </div>

    <div class="mt-5">
      <div class="form-control max-w-sm">
        <input
          class="input input-bordered"
          type="text"
          v-model="newResource"
          placeholder="New resource"
        />
        <button class="btn btn-secondary" @click="addResource">Add</button>
      </div>
    </div>
  </div>
</template>
