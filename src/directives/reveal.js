/**
 * Директива v-reveal — появление элементов при скролле.
 *
 * <div v-reveal>…</div>
 * <div v-reveal="2">…</div>                      — задержка каскада
 * <div v-reveal="{ delay: 1, wait: true }">…</div> — ждать готовности прелоадера
 *
 * Построчный показ — через класс .mask внутри контейнера:
 * когда элемент пересёк границу вьюпорта, ему вешается .is-in.
 */

let ready = false
const pending = new Set()
const hasIO = typeof IntersectionObserver !== 'undefined'

const observer = hasIO
  ? new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue

          const el = entry.target

          // hero должен выезжать строго после прелоадера
          if (el.dataset.revealWait === 'true' && !ready) {
            pending.add(el)
            continue
          }

          el.dataset.revealOnce === 'false' || observer.unobserve(el)
          el.classList.add('is-in')
        }
      },
      // срабатывает чуть ЗАРАНЕЕ: под 8% до края кадра,
      // чтобы при быстрой прокрутке не было пустых «белых» зон
      { threshold: 0.05, rootMargin: '0px 0px 8% 0px' }
    )
  : null

/* Watchdog: некоторые webview (VS Code и пр.) молча глушат IO.
   Пробный элемент не стрельнул за 2.5с — показываем весь сайт сразу. */
if (observer && document.body) {
  const probe = document.createElement('div')
  probe.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none'
  document.body.appendChild(probe)
  let alive = false
  const probeIO = new IntersectionObserver(() => {
    alive = true
    probeIO.disconnect()
    probe.remove()
  })
  probeIO.observe(probe)
  setTimeout(() => {
    if (!alive) {
      document.documentElement.classList.add('io-dead')
      observer.disconnect()
    }
    probe.remove()
  }, 2500)
}

/** Вызывается прелоадером: контент открывается. */
export function setReady() {
  if (ready) return
  ready = true
  for (const el of pending) {
    observer.unobserve(el)
    // небольшая задержка, чтобы шторка успела начать уезжать
    setTimeout(() => el.classList.add('is-in'), 120)
  }
  pending.clear()
}

const parse = (value) => {
  if (value == null) return {}
  if (typeof value === 'number') return { delay: value }
  return value
}

export const vReveal = {
  mounted(el, binding) {
    const { delay = 0, wait = false, once = true } = parse(binding.value)
    el.dataset.revealOnce = String(once)
    el.style.setProperty('--reveal-delay', delay)

    // нет IntersectionObserver (древние webview) — показываем сразу
    if (!observer) {
      el.classList.add('is-in')
      return
    }

    el.setAttribute('data-reveal', '')
    if (wait) el.dataset.revealWait = 'true'
    observer.observe(el)
  },
  unmounted(el) {
    observer?.unobserve(el)
    pending.delete(el)
  },
}
