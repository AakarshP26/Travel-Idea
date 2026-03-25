import { useState, useMemo, useEffect } from 'react'
import { Place } from '../data/places'
import { sortPlaces, SortMode } from '../hooks/useSort'
import { fetchAllPlaces } from '../hooks/usePlaces'
import PlaceCard from './PlaceCard'
import FilterBar from './FilterBar'

export default function Feed() {
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [activeCat, setActiveCat] = useState('All')
  const [activeRegion, setActiveRegion] = useState('All')
  const [sortMode, setSortMode] = useState<SortMode>('none')

  useEffect(() => {
    fetchAllPlaces((done, total) => setProgress(Math.round((done / total) * 100)))
      .then((data) => { setPlaces(data); setLoading(false) })
  }, [])

  function handleRegion(r: string) {
    setActiveRegion(r)
    if (r === 'All') setSortMode('none')
  }

  const displayed = useMemo(() => {
    const filtered = places.filter(
      (p) => (activeCat === 'All' || p.cat === activeCat) && (activeRegion === 'All' || p.region === activeRegion)
    )
    return sortPlaces(filtered, sortMode)
  }, [places, activeCat, activeRegion, sortMode])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-gray-900">Discover the world</h1>
        <p className="text-sm text-gray-500 mt-1">Places worth visiting, from every corner</p>
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center gap-4">
          <p className="text-sm text-gray-500">Loading places from around the world... {progress}%</p>
          <div className="w-64 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gray-900 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-gray-400">Fetching from Google Places + Pexels</p>
        </div>
      ) : (
        <>
          <FilterBar
            activeCat={activeCat}
            activeRegion={activeRegion}
            sortMode={sortMode}
            onCat={setActiveCat}
            onRegion={handleRegion}
            onSort={setSortMode}
          />
          {(activeCat !== 'All' || activeRegion !== 'All') && (
            <p className="text-xs text-gray-400 mb-4">
              {displayed.length} place{displayed.length !== 1 ? 's' : ''} shown
              {sortMode !== 'none' && ' · sorted by area'}
            </p>
          )}
          {displayed.length === 0 ? (
            <div className="py-16 text-center text-sm text-gray-400">No places match — try a different filter.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {displayed.map((place) => <PlaceCard key={place.id} place={place} />)}
            </div>
          )}
        </>
      )}
    </div>
  )
}
