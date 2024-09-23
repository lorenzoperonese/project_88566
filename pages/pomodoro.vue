<script setup lang="ts">
  const mode = ref(true) // true per 'Studio + Pausa', false per 'Totale'
  const tot = ref(40)
  const proposte = ref<Combinazione[]>([])

  interface Combinazione {
    difficolta: string;
    cicli: number;
    studio: number;
    pausa: number;
  }

  function calcolaCombinazioni () { // si può fare meglio
    proposte.value = [];
    function creaCombinazione(difficolta: string): Combinazione {
      const studioBase = difficolta === 'hard' ? 45 : difficolta === 'medium' ? 40 : 30;
      const pausaBase = difficolta === 'hard' ? 5 : 10;
      const cicli = Math.max(1, Math.floor(tot.value / (studioBase + pausaBase))); // almeno un ciclo
      let studio = Math.min(studioBase, Math.floor(tot.value / cicli));
      let pausa = Math.floor((tot.value - studio * cicli) / cicli);

      // Tenta di rendere i valori divisibili per 5
      if (pausa >= 5) {
        pausa = Math.floor(pausa / 5) * 5;
        studio = Math.floor((tot.value - pausa * cicli) / cicli);
      }

      // Aggiusta il tempo rimanente
      let tempoRimanente = tot.value - (studio * cicli + pausa * cicli);
      if (tempoRimanente > 0) {
        studio += Math.floor(3 * tempoRimanente / 4 * cicli);
        tempoRimanente -= Math.floor(3 * tempoRimanente / 4 * cicli);
        pausa += Math.floor(tempoRimanente / cicli);
      }
      return { difficolta, cicli, studio, pausa };
    }

    proposte.value.push(creaCombinazione("hard"));
    proposte.value.push(creaCombinazione("medium"));
    proposte.value.push(creaCombinazione("easy"));
  }

  const toggleMode = () => {
    proposte.value = [];
    mode.value = !mode.value;
  }

  const start = () => {
    console.log('Start');
  }

</script>

<template>
  <div>
    <h1>Pomodoro</h1>
    <form v-if="mode">
      <input class="text-center py-4 text-xl " type="number" placeholder="35" />
      <input class="text-center py-4 text-xl" type="number" placeholder="5" />
    </form>
    <form v-else>
      <input v-model="tot" class="text-center py-4 text-xl" type="number" placeholder="40" />
    </form>
    <button v-if="mode" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 w-36 rounded" @click="toggleMode">
      Totale
    </button>
    <button v-else class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 w-36 rounded" @click="toggleMode">
      Studio + Pausa
    </button>
    <button
      v-if="!mode" class="ml-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 w-36 rounded" @click="calcolaCombinazioni">
      Proponi
    </button>
  </div>
  <ul v-if="proposte.length">
    <li v-for="combinazione in proposte" :key="`${combinazione.cicli}-${combinazione.studio}-${combinazione.pausa}`">
      <button class="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-20 rounded" @click="start">
        {{ combinazione.difficolta }}: {{ combinazione.cicli }} cicli da {{ combinazione.studio }} minuti di studio e {{ combinazione.pausa }} minuti di pausa
      </button>
    </li>
  </ul>
  <button v-if="mode" class="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 w-80 rounded" @click="start">
    Start
  </button>
</template>