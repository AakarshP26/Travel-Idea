import { Place } from '../data/places'
export type SortMode = 'none' | 'asc' | 'desc'

function timSort(arr: Place[], dir: 'asc' | 'desc'): Place[] {
  const RUN = 4
  const n = arr.length
  const a = [...arr]
  const cmp = (x: Place, y: Place) => dir === 'asc' ? x.area - y.area : y.area - x.area
  for (let i = 0; i < n; i += RUN) {
    const end = Math.min(i + RUN - 1, n - 1)
    for (let j = i + 1; j <= end; j++) {
      const key = a[j]; let k = j - 1
      while (k >= i && cmp(a[k], key) > 0) { a[k + 1] = a[k]; k-- }
      a[k + 1] = key
    }
  }
  for (let sz = RUN; sz < n; sz *= 2) {
    for (let l = 0; l < n; l += 2 * sz) {
      const m = Math.min(l + sz - 1, n - 1)
      const r = Math.min(l + 2 * sz - 1, n - 1)
      if (m < r) {
        const L = a.slice(l, m + 1), R = a.slice(m + 1, r + 1)
        let i = 0, j = 0, k = l
        while (i < L.length && j < R.length) cmp(L[i], R[j]) <= 0 ? (a[k++] = L[i++]) : (a[k++] = R[j++])
        while (i < L.length) a[k++] = L[i++]
        while (j < R.length) a[k++] = R[j++]
      }
    }
  }
  return a
}

export function sortPlaces(places: Place[], mode: SortMode): Place[] {
  if (mode === 'none') return places
  return timSort(places, mode)
}

export function formatArea(area: number): string {
  if (area < 1) return `${(area * 1000).toFixed(0)}m wide`
  if (area < 100) return `${area.toFixed(1)} km²`
  if (area < 10000) return `${Math.round(area).toLocaleString()} km²`
  return `${(area / 1000).toFixed(0)}K km²`
}
