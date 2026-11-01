/**
 * Работа с датами «Дороги».
 * Данные хранят настоящие даты ('2025-10-01', день можно опустить: '2025-10'),
 * а сезон (Осень / Весна / Лето / Зима) выводится в интерфейсе сам.
 */

const SEASONS = {
  12: 'Зима',
  1: 'Зима',
  2: 'Зима',
  3: 'Весна',
  4: 'Весна',
  5: 'Весна',
  6: 'Лето',
  7: 'Лето',
  8: 'Лето',
  9: 'Осень',
  10: 'Осень',
  11: 'Осень',
}

const parseParts = (iso) => {
  const [, year, m, d] = String(iso).match(/^(\d{4})[-./](\d{1,2})(?:[-./](\d{1,2}))?$/) ?? []
  return {
    year,
    month: m !== undefined ? Number(m) : undefined,
    day: d !== undefined ? Number(d) : undefined,
  }
}

/** '2025-10-01' → 'Осень' */
export const seasonOf = (iso) => SEASONS[parseParts(iso).month] ?? ''

/** '2025-10-01' → '01.10.2025' (или '10.2025', если день не указан) */
export const prettyDate = (iso) => {
  const { year, month, day } = parseParts(iso)
  if (!month) return String(iso)
  const mm = String(month).padStart(2, '0')
  return day ? `${String(day).padStart(2, '0')}.${mm}.${year}` : `${mm}.${year}`
}

/** ['2025-10-01', '2025-06-25'] → 'Осень · Лето' — без повторов, в порядке следования */
export const seasonsLine = (isоs) => {
  const seen = new Set()
  const line = []
  for (const iso of isоs) {
    const season = seasonOf(iso)
    if (season && !seen.has(season)) {
      seen.add(season)
      line.push(season)
    }
  }
  return line.join(' · ')
}
