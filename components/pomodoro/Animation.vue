<script setup lang="ts">
const $props = defineProps<{
  state: string
  timer: number
}>()

const reset = ref(false)

watch(
  () => $props.state,
  () => {
    if ($props.state === 'stop') {
      resetAnimation()
    }
  }
)

watch(
  () => $props.timer,
  () => {
    resetAnimation()
  }
)

function resetAnimation() {
  reset.value = true
  setTimeout(() => {
    reset.value = false
  }, 1000)
}

const sauceState = computed(() => ({
  animationDuration: $props.timer * 60 + 5 + 's',
  animationPlayState: `${$props.state === 'study' ? 'running' : 'paused'}`
}))
</script>

<template>
  <div>
    <div class="scene">
      <div class="basket">
        <div class="tomato tomato1"></div>
        <div class="tomato tomato2"></div>
        <div class="tomato tomato3"></div>
        <div class="tomato tomato4"></div>
      </div>
      <div class="wooden-board">
        <div class="wooden-lines"></div>
      </div>
      <div class="jar">
        <div class="jar-label">Salsa</div>
        <div :class="{ sauce: !reset }" :style="sauceState"></div>
        <div class="leaves">
          <div class="leaf"></div>
          <div class="leaf"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scene {
  position: relative;
  width: 400px;
  height: 400px;
}

.wooden-board {
  position: absolute;
  top: 140px;
  width: 300px;
  height: 30px;
  background: #8b4513;
  transform: rotate(20deg);
  /* Solo questa riga è cambiata */
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.wooden-lines {
  position: absolute;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 20px,
    #704214 20px,
    #704214 22px
  );
}

.basket {
  position: absolute;
  top: 40px;
  left: 20px;
  width: 100px;
  height: 60px;
  border: 4px solid #8b4513;
  border-radius: 0 0 50% 50%;
  background: #deb887;
}

.jar {
  position: absolute;
  bottom: 0;
  right: 40px;
  width: 140px;
  height: 200px;
  background: transparent;
  border: 6px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
}

.jar-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 10px;
  border-radius: 5px;
  font-family: Arial;
  font-weight: bold;
  color: #333;
  z-index: 2;
}

.sauce {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: #ff6b6b;
  animation-name: fill;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.tomato {
  width: 30px;
  height: 30px;
  background: #ff4444;
  border-radius: 50%;
  position: absolute;
  top: 15px;
}

.tomato::after {
  content: '';
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 10px;
  background: #4caf50;
  border-radius: 10px 10px 0 0;
}

.tomato1 {
  left: 10px;
}

.tomato2 {
  left: 35px;
}

.tomato3 {
  left: 60px;
}

.tomato4 {
  left: 60px;
  animation: rollTomato 8s infinite;
}

@keyframes rollTomato {
  0% {
    transform: translateX(0) translateY(0) rotate(0deg);
    opacity: 1;
  }

  20% {
    transform: translateX(100px) translateY(50px) rotate(180deg);
    opacity: 1;
  }

  40% {
    transform: translateX(200px) translateY(90px) rotate(360deg);
    opacity: 1;
  }

  45% {
    transform: translateX(250px) translateY(220px) rotate(540deg);
    opacity: 0;
  }

  100% {
    transform: translateX(250px) translateY(220px) rotate(540deg);
    opacity: 0;
  }
}

@keyframes fill {
  0% {
    height: 0px;
  }

  100% {
    height: 180px;
  }
}

@keyframes empty {
  0% {
    height: 180px;
  }

  100% {
    height: 0px;
  }
}

.leaves {
  position: absolute;
  top: -15px;
  width: 100%;
  display: flex;
  justify-content: space-around;
}

.leaf {
  width: 20px;
  height: 30px;
  background: #4caf50;
  border-radius: 0 50% 0 50%;
  transform: rotate(45deg);
}
</style>
