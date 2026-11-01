<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { roadmap } from '../data/site'
import { prettyDate, seasonOf } from '../utils/dates'

const section = ref(null)
const fill = ref(null)
const body = ref(null)

let raf = 0
let spy = null
let entrySpy = null
let videoSpy = null

/* нить жизни: заливается оранжевым по мере прокрутки секции */
const update = () => {
  if (!section.value || !fill.value) return
  const rect = section.value.getBoundingClientRect()
  const p = Math.min(1, Math.max(0, (window.innerHeight * 0.6 - rect.top) / rect.height))
  fill.value.style.transform = `scaleY(${p})`
}

const onScroll = () => {
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(update)
}

/* достижение: строка или { point, links: [{ label, url }] } — пруфы могут и не прийти */
const pointsOf = (entry) => (Array.isArray(entry.text) ? entry.text : [entry.text])
const pointText = (item) => (typeof item === 'string' ? item : (item?.point ?? ''))

const hostOf = (href) => {
  try {
    return new URL(href).host.replace(/^www\./, '')
  } catch {
    return href
  }
}

const itemLinks = (item) =>
  typeof item === 'string'
    ? []
    : (item?.links ?? [])
        .filter((link) => link?.url)
        .map((link) => ({
          href: link.url,
          label: link.label || hostOf(link.url),
        }))

/* все пруфы записи по порядку пунктов */
const proofsOf = (entry) => pointsOf(entry).flatMap(itemLinks)

/* ---------- просмотр медиа: полноэкранный лайтбокс, caption сверху ---------- */

const active = ref(null) /* { src, name, caption, isVideo } */
/* сезон текущей записи — меняется на ходу, рядом с годом */
const activeSeasons = ref({})

const openNote = (media) => {
  active.value = {
    src: media.src,
    name: media.src.split('/').pop(),
    caption: media.caption || '',
    isVideo: media.type === 'video',
  }
}

const closeNote = () => {
  active.value = null
}

/* пока лайтбокс открыт — страница не прокручивается */
watch(active, (value) => {
  document.body.classList.toggle('is-locked', Boolean(value))
})

const onKey = (e) => {
  if (e.key === 'Escape') closeNote()
}

onMounted(() => {
  update()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)

  /* активный год: контурный пока не видим, наливается цветом в центре кадра */
  spy = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        entry.target.classList.toggle('is-active', entry.isIntersecting)
      }
    },
    { rootMargin: '-38% 0px -52% 0px' }
  )
  for (const el of body.value.querySelectorAll('.road-year')) spy.observe(el)

  /* текущая запись в кадре — её сезон всплывает рядом с годом */
  entrySpy = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const year = entry.target.closest('.road-year')?.dataset.year
        const season = entry.target.dataset.season
        if (year && season) {
          activeSeasons.value = { ...activeSeasons.value, [year]: season }
        }
      }
    },
    { rootMargin: '-38% 0px -52% 0px' }
  )
  for (const el of body.value.querySelectorAll('.road-entry')) entrySpy.observe(el)

  /* видео оживает, когда попадает в кадр, и замирает — когда уходит */
  videoSpy = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const video = entry.target
        if (entry.isIntersecting) video.play().catch(() => {})
        else video.pause()
      }
    },
    { threshold: 0.4 }
  )
  for (const video of body.value.querySelectorAll('video.road-media')) {
    video.muted = true
    videoSpy.observe(video)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  window.removeEventListener('keydown', onKey)
  document.body.classList.remove('is-locked')
  cancelAnimationFrame(raf)
  spy?.disconnect()
  entrySpy?.disconnect()
  videoSpy?.disconnect()
})
</script>

<template>
  <section id="road" class="road section" ref="section">
    <div class="section-head">
      <h2 class="display section-title" v-reveal>Путь от 0 до 1</h2>
      <span class="mono mc">
        {{ roadmap[roadmap.length - 1].year }} → {{ roadmap[0].year }} — пролистай жизнь
      </span>
    </div>

    <div class="road-body" ref="body">
      <div class="road-line" aria-hidden="true">
        <span class="road-line-fill" ref="fill" />
      </div>

      <div
        v-for="block in roadmap"
        :key="block.year"
        class="road-year"
        :data-year="block.year"
        v-reveal
      >
        <div class="road-sticky">
          <span class="mono road-year-label mc">{{ block.title }}</span>
          <h3 class="display road-year-num">{{ block.year }}</h3>
          <transition name="season-pop" mode="out-in">
            <span :key="activeSeasons[block.year] ?? ''" class="mono road-year-season">
              {{ activeSeasons[block.year] || seasonOf(block.entries[0]?.date) }}
            </span>
          </transition>
        </div>

        <div class="road-entries">
          <article
            v-for="(entry, i) in block.entries"
            :key="entry.title"
            class="road-entry"
            :data-season="seasonOf(entry.date)"
            v-reveal="i + 1"
          >
            <header class="road-entry-head">
              <span class="mono road-entry-index mc">
                {{ block.year }}.{{ String(i + 1).padStart(2, '0') }}
              </span>
              <h4 class="road-entry-title">{{ entry.title }}</h4>
              <span class="mono road-entry-date mc">{{ prettyDate(entry.date) }}</span>
            </header>

            <div v-if="entry.images?.length" class="road-strip" data-hover>
              <figure
                v-for="media in entry.images"
                :key="media.src"
                class="road-fig"
                role="button"
                tabindex="0"
                aria-label="Открыть в полном размере"
                @click="openNote(media)"
                @keydown.enter.prevent="openNote(media)"
              >
                <video
                  v-if="media.type === 'video'"
                  class="road-media"
                  :src="media.src"
                  muted
                  loop
                  playsinline
                  preload="metadata"
                />
                <img
                  v-else
                  class="road-media"
                  :src="media.src"
                  :alt="media.caption || entry.title"
                  loading="lazy"
                />
                <figcaption v-if="media.caption" class="road-cap">
                  {{ media.caption }}
                </figcaption>
              </figure>
              <span v-if="entry.images.length > 1" class="mono road-hint mc">лента →</span>
            </div>

            <ol
              v-if="pointsOf(entry).length > 1"
              class="road-entry-text road-points"
            >
              <li v-for="(point, p) in pointsOf(entry)" :key="p">{{ pointText(point) }}</li>
            </ol>
            <p v-else class="road-entry-text">{{ pointText(pointsOf(entry)[0]) }}</p>

            <!-- все пруф-ссылки записи: внизу, через «/», градиентным текстом -->
            <div v-if="proofsOf(entry).length" class="road-proofs mono">
              <template v-for="(proof, i) in proofsOf(entry)" :key="i">
                <a
                  :href="proof.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-hover
                >
                  {{ proof.label }} ↗
                </a>
                <span
                  v-if="i !== proofsOf(entry).length - 1"
                  class="road-proof-slash"
                  aria-hidden="true"
                >
                  /
                </span>
              </template>
            </div>
          </article>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <transition name="note-pop">
        <div
          v-if="active"
          class="road-lightbox"
          role="dialog"
          aria-label="Просмотр медиа"
          @click.self="closeNote"
        >
          <button class="lightbox-close mono" type="button" @click="closeNote">✕ закрыть</button>

          <figure class="lightbox-fig">
            <figcaption class="lightbox-top">
              <h5 v-if="active.caption" class="lightbox-title display">
                {{ active.caption }}
                <span v-if="active.isVideo" class="mono mc">— видео</span>
              </h5>
              <span class="mono mc">{{ active.name }}</span>
            </figcaption>

            <video
              v-if="active.isVideo"
              :src="active.src"
              controls
              autoplay
              muted
              loop
              playsinline
            />
            <img v-else :src="active.src" :alt="active.caption" />
          </figure>
        </div>
      </transition>
    </Teleport>
  </section>
</template>

<style scoped>
.road {
  --road-col: clamp(120px, 22vw, 320px);
  --road-gap: clamp(2rem, 5vw, 4rem);
}

.road-body {
  position: relative;
}

/* ---------- нить жизни ---------- */

.road-line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: calc(var(--gutter) + var(--road-col) + var(--road-gap));
  width: 1px;
  background: var(--line);
}

.road-line-fill {
  position: absolute;
  inset: 0;
  background: var(--accent);
  transform: scaleY(0);
  transform-origin: top;
  will-change: transform;
}

/* ---------- блок года ---------- */

.road-year {
  display: grid;
  grid-template-columns: var(--road-col) minmax(0, 1fr);
  gap: 0 var(--road-gap);
  padding-bottom: clamp(3rem, 8vw, 6rem);
}

.road-sticky {
  position: sticky;
  top: clamp(1.5rem, 12vh, 6.5rem);
  align-self: start;
  display: grid;
  justify-items: end;
  gap: 0.45rem;
  text-align: right;
}

/* сезон текущей записи — всплывает при прокрутке */
.road-year-season {
  color: var(--accent-2);
  font-size: clamp(0.85rem, 1.2vw, 1rem);
  letter-spacing: 0.16em;
  margin-top: 0.2rem;
  min-height: 1.4em;
}

.season-pop-enter-active {
  transition: opacity 0.3s var(--ease-out), transform 0.4s var(--ease-out);
}

.season-pop-leave-active {
  transition: opacity 0.18s ease-in, transform 0.25s ease-in;
}

.season-pop-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.season-pop-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.road-year-num {
  font-size: clamp(2.4rem, 7vw, 5.5rem);
  line-height: 0.9;
  color: transparent;
  -webkit-text-stroke: 1.5px var(--ink);
  transition: color 0.5s var(--ease-out), -webkit-text-stroke-color 0.5s;
}

.road-year.is-active .road-year-num {
  color: var(--ink);
  -webkit-text-stroke-color: transparent;
}

/* ---------- записи ---------- */

.road-entries {
  /* не даём грид-колонке раздуваться содержимым лент */
  min-width: 0;
  padding-left: clamp(1.4rem, 3.5vw, 2.8rem);
}

.road-entry {
  position: relative;
  padding-bottom: clamp(2rem, 5vw, 3.4rem);
}

/* маркер на нити */
.road-entry::before {
  content: '';
  position: absolute;
  top: 7px;
  left: calc(-1 * clamp(1.4rem, 3.5vw, 2.8rem) - 4.5px);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid var(--ink);
  background: var(--bg);
  transition: background 0.8s var(--ease-out), border-color 0.8s;
}

.road-entry.is-in::before {
  background: var(--accent);
  border-color: var(--accent);
}

.road-entry-head {
  display: flex;
  align-items: baseline;
  gap: clamp(0.8rem, 2vw, 1.6rem);
  margin-bottom: clamp(0.9rem, 2vw, 1.4rem);
}

.road-entry-title {
  font-size: clamp(1.25rem, 2.6vw, 2rem);
  font-weight: 600;
  line-height: 1.15;
}

.road-entry-date {
  margin-left: auto;
  white-space: nowrap;
}

/* ---------- лента картинок ---------- */

.road-strip {
  display: flex;
  gap: clamp(0.8rem, 1.6vw, 1.4rem);
  overflow-x: auto;
  max-width: 100%;
  min-width: 0;
  scrollbar-width: none;
  border: 1px solid var(--line);
  padding: clamp(0.8rem, 1.6vw, 1.2rem);
  margin-bottom: clamp(0.9rem, 2vw, 1.3rem);
  position: relative;
  /* колесо мыши не должно уезжать вбок */
  overscroll-behavior-x: contain;
}

.road-strip::-webkit-scrollbar {
  display: none;
}

.road-fig {
  flex: 0 0 auto;
  scroll-snap-align: start;
  width: clamp(240px, 34vw, 440px);
  position: relative;
  cursor: pointer;
}

.road-media {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
  border: 1px solid var(--line);
  transform: scale(1.05);
  transition: transform 1.4s var(--ease-expo), border-color 0.5s;
}

.road-fig.is-in .road-media {
  transform: scale(1);
}

.road-fig:hover .road-media {
  transform: scale(1.02);
}

.road-cap {
  margin-top: 0.55rem;
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0.01em;
  color: var(--ink-soft);
}

.road-hint {
  position: absolute;
  top: 0.5rem;
  right: 0.7rem;
  pointer-events: none;
}

.road-entry-text {
  max-width: 74ch;
  font-size: 1.08rem;
  line-height: 1.75;
  color: var(--ink-soft);
  text-wrap: pretty;
}

/* достижения — пункты с точечкой */
.road-points {
  list-style: none;
  display: grid;
  gap: 0.35rem;
  padding: 0;
}

.road-points li {
  display: flex;
  align-items: baseline;
  gap: 0.6em;
}

.road-points li::before {
  content: '•';
  flex: 0 0 auto;
  min-width: 0.9em;
  color: var(--accent-2);
  font-size: 1.05em;
  line-height: 1;
  transform: translateY(2px);
}

/* пруфы записи — снизу через «/»; название — ярко-синее, слэш — градиент */
.road-proofs {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.35rem 0.7rem;
  margin-top: 0.95rem;
}

.road-proof-slash {
  font-weight: 700;
  background: linear-gradient(90deg, var(--accent-2) 0%, var(--accent) 45%, #0a1230 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  transform: translateY(-1px);
}

.road-proofs a {
  color: var(--accent-2);
  white-space: nowrap;
  transition: color 0.25s;
}

.road-proofs a:hover {
  color: var(--accent);
}

/* ---------- полноэкранный просмотр медиа ---------- */

.road-lightbox {
  position: fixed;
  inset: 0;
  z-index: 130;
  background: rgba(5, 6, 10, 0.93);
  display: grid;
  place-items: center;
  padding: clamp(1rem, 4vw, 3rem) clamp(1rem, 6vw, 4.5rem);
}

.lightbox-fig {
  margin: 0;
  width: min(1100px, 100%);
  max-height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  background: var(--panel);
  border: 1px solid var(--ink-line);
  padding: 8px;
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.6);
}

.lightbox-fig img,
.lightbox-fig video {
  width: 100%;
  max-height: 68vh;
  display: block;
  object-fit: contain;
  background: var(--bg);
  border: 1px solid var(--line);
}

/* строка caption сверху: заголовок слева, имя файла справа */
.lightbox-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.5rem 0.35rem 0.6rem;
  min-width: 0;
}

.lightbox-title {
  font-size: clamp(1.1rem, 2.2vw, 1.5rem);
  line-height: 1.15;
  color: var(--ink);
}

.lightbox-top .mono {
  flex: 0 0 auto;
}

.lightbox-close {
  position: absolute;
  z-index: 1;
  top: 1.1rem;
  right: 1.3rem;
  font-size: 0.72rem;
  color: var(--ink-muted);
  border: 1px solid var(--line);
  background: rgba(11, 12, 16, 0.75);
  padding: 0.4rem 0.75rem;
  transition: color 0.2s, border-color 0.2s;
}

.lightbox-close:hover {
  color: var(--ink);
  border-color: var(--ink-line);
}

/* появление лайтбокса */
.note-pop-enter-active {
  transition: opacity 0.3s var(--ease-out), transform 0.35s var(--ease-out);
}

.note-pop-leave-active {
  transition: opacity 0.18s ease-in, transform 0.22s ease-in;
}

.note-pop-enter-from,
.note-pop-leave-to {
  opacity: 0;
  transform: scale(0.985) translateY(8px);
}

/* ---------- адаптив ---------- */

@media (max-width: 760px) {
  .road-year {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .road-sticky {
    position: static;
    justify-items: start;
    text-align: left;
    margin-bottom: 1.2rem;
  }

  .road-line {
    left: calc(var(--gutter) + 4px);
  }

  .road-entries {
    padding-left: clamp(1.6rem, 6vw, 2.4rem);
  }

  .road-entry::before {
    left: calc(-1 * clamp(1.6rem, 6vw, 2.4rem) - 4.5px);
  }
}
</style>
