const CATS = ['All','scenic','restaurant','party','beach','market','adventure','landmark','rooftop']
const REGIONS = ['All','Americas','Europe','Asia','Middle East','Africa','Oceania']

interface Props {
  activeCat: string
  activeRegion: string
  sortMode: 'none' | 'asc' | 'desc'
  onCat: (c: string) => void
  onRegion: (r: string) => void
  onSort: (s: 'none' | 'asc' | 'desc') => void
}

export default function FilterBar({ activeCat, activeRegion, sortMode, onCat, onRegion, onSort }: Props) {
  return (
    <div className="space-y-3 mb-6">
      <div className="flex flex-wrap gap-2">
        {CATS.map((c) => (
          <button key={c} onClick={() => onCat(c)}
            className={`text-xs px-3.5 py-1.5 rounded-full border transition-all ${activeCat === c ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
            {c}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-gray-400 mr-1">Region:</span>
        {REGIONS.map((r) => (
          <button key={r} onClick={() => onRegion(r)}
            className={`text-xs px-3.5 py-1.5 rounded-full border transition-all ${activeRegion === r ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
            {r}
          </button>
        ))}
      </div>
      {activeRegion !== 'All' && (
        <div className="flex items-center gap-2 pt-1">
          <span className="text-xs text-gray-400">Sort by area:</span>
          {(['none','asc','desc'] as const).map((s) => (
            <button key={s} onClick={() => onSort(s)}
              className={`text-xs px-3 py-1 rounded-lg border transition-all ${sortMode === s ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>
              {s === 'none' ? 'Default mix' : s === 'asc' ? 'Smallest first' : 'Largest first'}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
