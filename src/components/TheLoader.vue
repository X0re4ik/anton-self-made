<script setup>
import { onMounted, ref } from 'vue'

const emit = defineEmits(['done'])

const progress = ref(0)
const leaving = ref(false)

onMounted(() => {
  // 0 → 100, скорость нарастает как у настоящего Лоадера
  const tick = () => {
    progress.value = Math.min(100, progress.value + Math.max(0.4, (100 - progress.value) / 28))
    if (progress.value >= 100) {
      leaving.value = true
      setTimeout(() => emit('done'), 1100)
      return
    }
    setTimeout(tick, 34)
  }
  tick()
})
</script>

<template>
  <div class="loader" :class="{ leaving }" aria-hidden="true">
    <div class="loader-bar">
      <div class="loader-track">
        <div class="loader-fill" :style="{ transform: `scaleX(${progress / 100})` }" />
      </div>
      <span class="mono">{{ String(Math.floor(progress)).padStart(3, '0') }} %</span>
    </div>

    <div class="loader-mark">
      <span class="mask"><span class="mask-in" :class="{ 'is-in': progress > 12 }">Мочалов</span></span>
      <span class="mask"><span class="mask-in" :class="{ 'is-in': progress > 35 }">Антон</span></span>
    </div>

    <span class="mono loader-tagline">Технологии / Ум / Стиль</span>
  </div>
</template>

<style scoped>
.loader {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: #05060a;
  color: var(--ink);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: var(--gutter);
  transition: transform 1s var(--ease-expo), clip-path 0.01s 1s;
}

.loader.leaving {
  transform: translateY(-101%);
}

.loader-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.loader-track {
  flex: 1;
  height: 2px;
  background: var(--ink-line);
  overflow: hidden;
}

.loader-fill {
  height: 100%;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: left;
}

.loader-mark {
  font-family: var(--font-display);
  font-weight: 700;
  text-transform: uppercase;
  font-size: clamp(3.4rem, 15vw, 12rem);
  line-height: 0.92;
  letter-spacing: -0.01em;
}

.loader-mark .mask-in {
  transition: transform 1s var(--ease-expo);
}

.loader-mark .mask-in.is-in {
  transform: none;
}

.loader-tagline {
  color: var(--ink-muted);
  transition: opacity 0.3s;
}

.leaving .loader-tagline {
  opacity: 0;
}
</style>
