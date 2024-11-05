<script setup lang="ts">
const $model = defineModel({
  type: Number,
  required: true
})

interface Option {
  value: number
  name: string
}

const $props = defineProps({
  options: { type: Array as PropType<Option[]>, required: true }
})

const selected = ref(0)

const update = (s: number, v: number) => {
  selected.value = s
  $model.value = v
}
</script>

<template>
  <div class="dropdown">
    <div tabindex="0" role="button" class="btn m-1">
      {{ $props.options[selected].name }}
    </div>
    <ul
      tabindex="0"
      class="menu dropdown-content z-[1000] w-52 rounded-box bg-base-100 p-2 shadow"
    >
      <template v-for="[i, o] in $props.options.entries()">
        <li @click="update(i, o.value)">
          <a>
            {{ o.name }}
          </a>
        </li>
      </template>
    </ul>
  </div>
</template>
