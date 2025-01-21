<script setup lang="ts">
definePageMeta({
  layout: 'navbar'
})

const _route = useRoute()
const _router = useRouter()
const _id = _route.params.id

const { data: _resource } = await useFetch<Resource>(`/api/resources/${_id}`)

async function update() {
  const tmp = await $fetch(`/api/resources/${_id}`)
  _resource.value = tmp as Resource
  editMode.value = false

  _router.push('/calendar')
}

const editMode = ref(false)
</script>

<template>
  <div class="flex justify-center">
    <CalendarResourceAdder :resource="_resource || undefined" @close="update" />
  </div>
</template>
