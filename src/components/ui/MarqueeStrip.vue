<script setup>
defineProps({
  items: { type: Array, required: true },
  reverse: { type: Boolean, default: false },
  separator: { type: String, default: '•' },
})
</script>

<template>
  <div class="marquee" :class="{ reverse }" data-hover>
    <div class="marquee-row">
      <template v-for="n in 2" :key="n">
        <span
          v-for="(item, i) in items"
          :key="`${n}-${i}`"
          class="marquee-item"
          :aria-hidden="n === 2"
        >
          <span class="marquee-text">{{ item }}</span>
          <span class="marquee-sep" aria-hidden="true">{{ separator }}</span>
        </span>
      </template>
    </div>
  </div>
</template>

<style scoped>
.marquee {
  overflow: hidden;
  white-space: nowrap;
  user-select: none;
}

.marquee-row {
  display: inline-flex;
  align-items: baseline;
  animation: marquee 26s linear infinite;
}

.marquee.reverse .marquee-row {
  animation-direction: reverse;
}

.marquee:hover .marquee-row {
  animation-play-state: paused;
}

.marquee-item {
  display: inline-flex;
  align-items: baseline;
  gap: 1.2rem;
  padding-right: 1.2rem;
}

.marquee-sep {
  color: var(--accent);
}

@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
</style>
