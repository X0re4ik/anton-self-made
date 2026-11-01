<script setup>
import { ref } from 'vue'
import TheLoader from './components/TheLoader.vue'
import CursorFX from './components/CursorFX.vue'
import SiteHeader from './components/SiteHeader.vue'
import HeroSection from './components/HeroSection.vue'
import RoadmapSection from './components/RoadmapSection.vue'
import SiteFooter from './components/SiteFooter.vue'
import { setReady } from './directives/reveal'

const loaded = ref(false)

// шторка прелоадера уже в DOM — фиксируем скролл
document.body.classList.add('is-locked')

const markLoaded = () => {
  loaded.value = true
  document.body.classList.remove('is-locked')
  // hero выезжает вместе со шторкой
  setReady()
}
</script>

<template>
  <CursorFX />

  <TheLoader v-if="!loaded" @done="markLoaded" />

  <SiteHeader />

  <main>
    <HeroSection />
    <RoadmapSection />
    <SiteFooter />
  </main>
</template>

<style>
/* пока грузится шторка — не даём крутить колесо мыши */
body.is-locked {
  overflow: hidden;
}
</style>
