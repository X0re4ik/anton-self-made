<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Курсор под тёмную тему: маленькая синяя точка + кольцо-контур.
 * Никаких mix-blend/difference — на чёрном фоне это белые пятна.
 * На touch-устройствах остаётся нативный курсор.
 */
const dot = ref(null)
const ring = ref(null)
const active = ref(false)

let x = -100
let y = -100
let rx = -100
let ry = -100
let raf = 0

const fine = window.matchMedia('(pointer: fine)').matches

const onMove = (e) => {
  x = e.clientX
  y = e.clientY
}

const loop = () => {
  rx += (x - rx) * 0.16
  ry += (y - ry) * 0.16

  if (dot.value) dot.value.style.transform = `translate(${x}px, ${y}px)`
  if (ring.value) ring.value.style.transform = `translate(${rx}px, ${ry}px)`
  raf = requestAnimationFrame(loop)
}

const onOver = (e) => {
  const target = e.target.closest('a, button, [data-hover]')
  active.value = Boolean(target)
}

onMounted(() => {
  if (!fine) return
  document.body.dataset.cursorReady = 'true'
  window.addEventListener('mousemove', onMove, { passive: true })
  window.addEventListener('mouseover', onOver, { passive: true })
  raf = requestAnimationFrame(loop)
})

onBeforeUnmount(() => {
  if (!fine) return
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('mouseover', onOver)
  cancelAnimationFrame(raf)
})
</script>

<template>
  <div v-if="fine" class="custom-cursor">
    <div ref="ring" class="c-ring" :class="{ 'is-active': active }" />
    <div ref="dot" class="c-dot" :class="{ 'is-active': active }" />
  </div>
</template>

<style scoped>
.custom-cursor {
  position: fixed;
  inset: 0;
  z-index: 200;
  pointer-events: none;
}

.c-dot,
.c-ring {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 50%;
  will-change: transform;
}

.c-dot {
  width: 7px;
  height: 7px;
  margin: -3.5px;
  background: var(--accent-2);
}

.c-ring {
  width: 38px;
  height: 38px;
  margin: -19px;
  border: 1px solid rgba(148, 176, 255, 0.45);
  transition: width 0.25s var(--ease-out), height 0.25s var(--ease-out),
    margin 0.25s var(--ease-out), border-color 0.25s var(--ease-out),
    background 0.25s var(--ease-out);
}

/* ховер ссылки: кольцо растёт и подсвечивается синим — без белых заливок */
.c-ring.is-active {
  width: 60px;
  height: 60px;
  margin: -30px;
  border-color: var(--accent);
  border-width: 2px;
  background: rgba(47, 91, 255, 0.1);
}

.c-dot.is-active {
  background: var(--accent-2);
}
</style>
