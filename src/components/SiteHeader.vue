<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const time = ref('--:--:--')
let timer = 0

const tick = () => {
  time.value = new Date().toLocaleTimeString('ru-RU', { hour12: false })
}

onMounted(() => {
  tick()
  timer = setInterval(tick, 1000)
})

onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <header class="site-header">
    <a class="mono brand" href="#top" data-hover>
      Мочалов<span class="brand-slash">/</span>Антон
    </a>

    <nav class="mono nav">
      <a href="#road">Путь от 0 до 1</a>
      <a href="#contact">Контакт</a>
    </nav>

    <span class="mono clock mc">{{ time }} — LOCAL</span>
  </header>
</template>

<style scoped>
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 90;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1.1rem var(--gutter);
  color: var(--ink);
}

.brand {
  font-weight: 500;
  white-space: nowrap;
}

.brand-slash {
  color: var(--accent-2);
}

.nav {
  display: flex;
  gap: clamp(0.9rem, 2.4vw, 2.2rem);
}

.nav a {
  position: relative;
  opacity: 0.75;
  transition: opacity 0.25s;
}

.nav a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 100%;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.35s var(--ease-expo);
}

.nav a:hover {
  opacity: 1;
}

.nav a:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

.clock {
  white-space: nowrap;
}

@media (max-width: 720px) {
  .clock {
    display: none;
  }
}
</style>
