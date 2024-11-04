<script setup lang="ts">
const _totalTime = ref(200)

const _options = ref<Timer[]>([]) // 3 opzioni: hard, medium, easy TODO

// da cambiare
const _preferredStudyTime = ref(25)
const _proposal = computed(() => {
  const _cycles = Math.floor(_totalTime.value / (_preferredStudyTime.value + 5))
  const _studyTime = _preferredStudyTime.value
  const _breakTime = 5
  const _remainingTime = _totalTime.value - _cycles * (_studyTime + _breakTime)

  return {
    study: _studyTime,
    break: _breakTime,
    cycles: _cycles,
    remaining: _remainingTime
  }
})

const emit = defineEmits(['accept'])

function acceptProposal() {
  emit('accept', {
    study: _proposal.value.study,
    break: _proposal.value.break,
    cycles: _proposal.value.cycles
  })
}
</script>

<template>
  <div class="grid h-full place-items-center">
    <div class="text-center">
      <h2 class="mb-4 text-2xl font-bold">Proponi un Pomodoro</h2>
      <div class="mb-4 flex justify-center space-x-4">
        <div class="flex flex-col">
          <label class="mb-1 font-bold">Tempo totale (in minuti)</label>
          <input
            v-model.number="_totalTime"
            type="number"
            required
            class="input input-bordered w-full max-w-xs text-center"
            :min="1"
          />
        </div>
      </div>
      <div class="mb-4">
        <h3 class="text-xl font-bold">Proposta:</h3>
        <p>Studio: {{ _proposal.study }} min</p>
        <p>Pausa: {{ _proposal.break }} min</p>
        <p>Cicli: {{ _proposal.cycles }}</p>
        <p>Tempo rimanente: {{ _proposal.remaining }} min</p>
      </div>
      <button
        class="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        @click="acceptProposal"
      >
        Accetta proposta
      </button>
    </div>
  </div>
</template>
