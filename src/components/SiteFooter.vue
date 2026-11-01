<script setup>
import ArrowIcon from './ui/ArrowIcon.vue'
import { sources } from '../data/site'
</script>

<template>
  <footer id="contact" class="section dark footer">
    <div class="section-head">
      <h2 class="display section-title" v-reveal>Связь</h2>
      <span class="mono mc">Открыт к предложениям — отвечаю быстро</span>
    </div>

    <nav class="contact-list">
      <a
        v-for="(source, i) in sources"
        :key="source.label"
        :href="source.href"
        class="contact-row"
        v-reveal="i"
        data-hover
        :target="source.href.startsWith('http') ? '_blank' : undefined"
        :rel="source.href.startsWith('http') ? 'noreferrer' : undefined"
      >
        <span class="mono contact-id mc">{{ String(i + 1).padStart(2, '0') }}</span>
        <span class="display contact-label">{{ source.label }}</span>
        <span class="mono contact-note mc">{{ source.note }}</span>
        <ArrowIcon class="contact-arrow" />
      </a>
    </nav>

    <div class="footer-bottom mono mc">
      <span>© 2026 Мочалов Антон</span>
      <span>Технологии / Ум / Стиль</span>
      <a href="#top" data-hover>Наверх ↑</a>
    </div>
  </footer>
</template>

<style scoped>
/* дерзкий блок: сплошной синий, чёрный текст, инверсия при ховере */
.footer {
  --line: rgba(6, 8, 14, 0.32);
  --ink-line: rgba(6, 8, 14, 0.36);
  --muted: rgba(6, 8, 14, 0.66);
  --ink-muted: rgba(6, 8, 14, 0.8);
  --bg: #0b0d13;
  --ink: #0b0d13;
  background: var(--accent);
  color: var(--ink-muted);
}

.footer ::selection {
  background: var(--bg);
  color: var(--accent);
}

.footer :deep(.section-title),
.footer .section-title {
  color: var(--ink);
}

.footer :deep(.head-note) {
  color: var(--muted);
}

.contact-list {
  margin-top: clamp(1.4rem, 4vw, 2.6rem);
}

.contact-row {
  display: grid;
  grid-template-columns: 3.2rem 1fr auto 2.2rem;
  align-items: center;
  gap: clamp(1rem, 3vw, 2rem);
  padding: clamp(1.2rem, 2.8vw, 2.1rem) 0.5rem;
  border-top: 1px solid var(--ink-line);
  position: relative;
  isolation: isolate;
  overflow: hidden;
  color: var(--ink-muted);
  transition: color 0.4s var(--ease-out);
}

.contact-list :last-child .contact-row {
  border-bottom: 1px solid var(--ink-line);
}

/* заливка при ховере — строка наливается светлым */
.contact-row::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--bg);
  transform: translateY(101%);
  transition: transform 0.55s var(--ease-expo);
  z-index: -1;
}

.contact-row:hover::before {
  transform: translateY(0);
}

.contact-row:hover {
  color: #eef1f7;
}

.contact-label {
  font-size: clamp(1.8rem, 5vw, 4rem);
  font-weight: 500;
  transition: transform 0.45s var(--ease-expo);
}

.contact-row:hover .contact-label {
  transform: translateX(clamp(8px, 1.5vw, 22px));
}

.contact-note {
  font-size: clamp(0.68rem, 0.9vw, 0.8rem);
  white-space: nowrap;
}

.contact-arrow {
  width: 1.3rem;
  height: 1.3rem;
  transition: transform 0.45s var(--ease-expo);
}

.contact-row:hover .contact-arrow {
  transform: translate(4px, -4px);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: clamp(2.4rem, 6vw, 4rem);
}

.footer-bottom a:hover {
  color: #eef1f7;
}

@media (max-width: 760px) {
  .contact-row {
    grid-template-columns: 1fr auto;
    grid-template-areas:
      'label arrow'
      'note arrow';
  }

  .contact-id {
    display: none;
  }

  .contact-label {
    grid-area: label;
  }

  .contact-note {
    grid-area: note;
  }

  .contact-arrow {
    grid-area: arrow;
  }
}
</style>
