<script setup>
import MarqueeStrip from './ui/MarqueeStrip.vue'
import RobotScene from './RobotScene.vue'
import { photo, skills } from '../data/site'
</script>

<template>
  <section id="top" class="hero">
    <div class="hero-meta mono">
      <span class="hero-meta-right">Версия 1.1 — 2026</span>
    </div>

    <RobotScene class="hero-robot" aria-hidden="true" />

    <h1 class="display hero-title" v-reveal="{ wait: true }">
      <span class="mask"><span class="mask-in hero-line">Мочалов</span></span>
      <span class="mask"><span class="mask-in hero-line">Антон<span class="hero-accent">*</span></span></span>
    </h1>

    <figure class="hero-photo" v-reveal="{ delay: 3, wait: true }" data-hover>
      <img :src="photo" alt="Портрет Антона" />
      <figcaption class="mono">
        <span>anton.jpg</span>
        <span class="mc">1 / 1</span>
      </figcaption>
    </figure>

    <div class="hero-sub">
      <ul class="hero-tags mono" v-reveal="{ delay: 2, wait: true }">
        <li><span class="tick">→</span>С++</li>
        <li><span class="tick">→</span>Python</li>
        <li><span class="tick">→</span>ROS</li>
        <li><span class="tick">→</span>DevOps</li>
      </ul>
    </div>

    <div class="hero-skillbar mono mc" v-reveal="{ delay: 2, wait: true }">
    </div>
    <MarqueeStrip :items="skills" separator="/" class="hero-marquee" />
  </section>
</template>

<style scoped>
.hero {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: calc(var(--gutter) + 4rem) var(--gutter) var(--gutter);
  position: relative;
  overflow: hidden;
}

.hero::before {
  /* две вертикальные линии-сетка, держат композицию */
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(var(--line) 0 0) no-repeat calc(50% - 34vw) 0 / 1px 100%,
    linear-gradient(var(--line) 0 0) no-repeat calc(50% + 34vw) 0 / 1px 100%;
  pointer-events: none;
}

.hero-robot {
  position: absolute;
  z-index: 0;
  left: 50%;
  transform: translateX(-50%);
  bottom: 9rem;
  width: clamp(340px, 40vw, 580px);
}

.hero-meta {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px solid var(--line);
  padding-bottom: 0.85rem;
  margin-bottom: clamp(1.2rem, 4vh, 3rem);
  position: relative;
  z-index: 2;
}

.hero-meta-right {
  text-align: right;
}

.hero-title {
  position: relative;
  z-index: 2;
  pointer-events: none;
  font-size: clamp(4rem, 16vw, 13.5rem);
  font-weight: 700;
  margin-left: -0.04em;
}

.hero-accent {
  color: var(--accent);
}

/* ---------- портрет ---------- */

.hero-photo {
  position: absolute;
  z-index: 1;
  right: var(--gutter);
  bottom: 12rem;
  width: clamp(320px, 34vw, 520px);
  border: 1px solid var(--ink);
  background: var(--bg);
  padding: 6px;
}

.hero-photo img {
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  display: block;
  transform: rotate(1.2deg) scale(1.04);
  transition: transform 0.9s var(--ease-expo);
}

.hero-photo.is-in img {
  transform: rotate(1.2deg) scale(1);
}

.hero-photo:hover img {
  transform: rotate(0deg) scale(1.02);
}

.hero-photo figcaption {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 6px;
}

/* ---------- подпись и теги ---------- */

.hero-sub {
  position: relative;
  z-index: 2;
  border-top: 1px solid var(--line);
  padding: clamp(1rem, 3vh, 2rem) 0 clamp(1.4rem, 4vh, 2.6rem);
}

.hero-lead {
  max-width: 44ch;
  font-size: clamp(0.95rem, 1.4vw, 1.15rem);
  color: var(--muted);
  margin-bottom: 1rem;
}

.hero-tags {
  display: flex;
  gap: clamp(0.9rem, 2vw, 2rem);
  list-style: none;
}

.tick {
  color: var(--accent);
  margin-right: 0.35em;
}

.hero-skillbar {
  position: relative;
  z-index: 2;
  margin-bottom: 0.7rem;
}

.hero-marquee {
  border-top: 1px solid var(--line);
  padding-top: 0.9rem;
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(1.3rem, 2.6vw, 2.2rem);
  text-transform: uppercase;
  position: relative;
  z-index: 2;
}

@media (max-width: 980px) {
  .hero-robot {
    display: none;
  }

  .hero-photo {
    position: relative;
    right: auto;
    bottom: auto;
    width: clamp(220px, 46vw, 320px);
    margin: 2.2rem 0 0 auto;
  }
}
</style>
