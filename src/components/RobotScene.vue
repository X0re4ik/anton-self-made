<template>
  <!--
    Фоновый робот: гантри-манипулятор.
    Цикл ~7.6с: везёт кубик от питателя к стопке → опускается →
    раскрывает клешню → кладёт → возвращается за новым.
    Всё на CSS-анимациях, без библиотек.
  -->
  <svg class="robot-svg" viewBox="0 0 560 400" fill="none" aria-hidden="true">
    <text class="r-caption" x="22" y="20">Gantry-01 // Pick &amp; Place</text>

    <!-- рельса -->
    <line x1="14" y1="36" x2="546" y2="36" class="r-stroke" stroke-width="2" />
    <rect x="10" y="28" width="5" height="16" fill="currentColor" />
    <rect x="545" y="28" width="5" height="16" fill="currentColor" />

    <!-- тележка -->
    <g transform="translate(120 0)">
      <g class="carriage">
        <rect class="r-carriage" x="-25" y="22" width="50" height="26" />
        <circle class="r-light" cx="16" cy="35" r="3" />
        <!-- трос: не едет с клешнёй, а сам тянется вниз — иначе рвётся -->
        <line class="r-cable" x1="0" y1="48" x2="0" y2="100" />
        <g class="hang">
          <rect x="-17" y="100" width="34" height="10" fill="currentColor" />
          <path class="r-finger r-finger-l" d="M-13 110 L-19 134 L-11 142" />
          <path class="r-finger r-finger-r" d="M13 110 L19 134 L11 142" />
          <rect class="r-held" x="-20" y="138" width="40" height="40" />
        </g>
      </g>
    </g>

    <!-- питатель -->
    <path d="M40 352 V306 H112 V352" class="r-stroke" />
    <rect x="46" y="316" width="30" height="36" class="r-dim" />
    <rect x="80" y="316" width="30" height="36" class="r-dim" />
    <rect x="60" y="280" width="30" height="36" class="r-dim" />

    <!-- стопка -->
    <rect x="384" y="312" width="40" height="40" class="r-cube" />
    <rect x="384" y="272" width="40" height="40" class="r-cube" />
    <rect class="r-placed" x="384" y="232" width="40" height="40" />
    <text class="r-caption r-strong" x="436" y="256">+1</text>

    <!-- земля -->
    <line x1="8" y1="352" x2="552" y2="352" class="r-ground" />
    <text class="r-caption" x="22" y="376">Feeder</text>
    <text class="r-caption" x="384" y="376">Stack</text>
  </svg>
</template>

<style scoped>
.robot-svg {
  display: block;
  width: 100%;
  color: currentColor;
}

.r-stroke {
  stroke: currentColor;
  stroke-width: 2;
}

.r-ground {
  stroke: currentColor;
  stroke-width: 1;
  opacity: 0.35;
}

.r-caption {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  fill: currentColor;
  opacity: 0.55;
}

.r-strong {
  fill: var(--accent);
  opacity: 1;
  font-size: 14px;
}

.r-carriage {
  fill: var(--bg);
  stroke: currentColor;
  stroke-width: 2;
}

.r-light {
  fill: var(--accent);
  animation: r-blink 1.4s infinite;
}

.r-finger {
  stroke: currentColor;
  stroke-width: 2.5;
  stroke-linecap: round;
}

.r-cube,
.r-held {
  fill: var(--bg);
  stroke: currentColor;
  stroke-width: 2;
}

.r-held {
  animation: r-held 7.6s linear infinite;
}

.r-dim {
  stroke: currentColor;
  stroke-width: 2;
  opacity: 0.45;
}

.r-placed {
  fill: transparent;
  stroke: var(--accent);
  stroke-width: 2;
  animation: r-placed 7.6s linear infinite;
}

/* ---------- хореография ---------- */

.carriage {
  animation: r-travel 7.6s ease-in-out infinite;
  will-change: transform;
}

/* трос: тянется от каретки к клешне, чтобы не рвался при опускании */
.r-cable {
  stroke: currentColor;
  stroke-width: 2;
  transform-origin: 0px 48px;
  animation: r-cable 7.6s ease-in-out infinite;
  will-change: transform;
}

.hang {
  animation: r-lift 7.6s ease-in-out infinite;
  will-change: transform;
}

.r-finger-l {
  animation: r-finger 7.6s ease-in-out infinite;
}

.r-finger-r {
  animation: r-finger-r 7.6s ease-in-out infinite;
}

@keyframes r-travel {
  0%, 22% { transform: translateX(0); }
  40%, 74% { transform: translateX(284px); }
  92%, 100% { transform: translateX(0); }
}

/* те же фазы, что у подъёмника: пока клешня едет на 60px вниз,
   трос растягивается с 52px до 112px (в 2.1538 раза) */
@keyframes r-cable {
  0%, 22% { transform: scaleY(1); }
  34%, 60% { transform: scaleY(2.1538); }
  70%, 100% { transform: scaleY(1); }
}

@keyframes r-lift {
  0%, 22% { transform: translateY(0); }
  34%, 60% { transform: translateY(60px); }
  70%, 100% { transform: translateY(0); }
}

@keyframes r-finger {
  0%, 36% { transform: translateX(0); }
  40%, 56% { transform: translateX(8px); }
  60%, 100% { transform: translateX(0); }
}

@keyframes r-finger-r {
  0%, 36% { transform: translateX(0); }
  40%, 56% { transform: translateX(-8px); }
  60%, 100% { transform: translateX(0); }
}

@keyframes r-held {
  0%, 39% { opacity: 1; }
  42%, 90% { opacity: 0; }
  93%, 100% { opacity: 1; }
}

@keyframes r-placed {
  0%, 41% { opacity: 0; transform: translateY(-14px); }
  45% { opacity: 1; transform: translateY(-10px); }
  52%, 92% { opacity: 1; transform: translateY(0); }
  97%, 100% { opacity: 0; transform: translateY(0); }
}

@keyframes r-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.1; }
}

@media (prefers-reduced-motion: reduce) {
  .carriage,
  .hang,
  .r-cable,
  .r-finger-l,
  .r-finger-r,
  .r-held,
  .r-placed,
  .r-light {
    animation: none;
  }
}
</style>
