import { useRef, useState } from 'react'
import { Place } from '../data/places'
import { formatArea } from '../hooks/useSort'
import { useWishlist } from '../store/wishlist'

const CAT_COLORS: Record<string, string> = {
  party:      'bg-pink-100 text-pink-800',
  restaurant: 'bg-amber-100 text-amber-800',
  scenic:     'bg-emerald-100 text-emerald-800',
  landmark:   'bg-blue-100 text-blue-800',
  beach:      'bg-orange-100 text-orange-800',
  market:     'bg-purple-100 text-purple-800',
  adventure:  'bg-green-100 text-green-800',
  rooftop:    'bg-stone-100 text-stone-700',
}

const CAT_BADGE: Record<string, string> = {
  party:      'bg-pink-700/80 text-white',
  restaurant: 'bg-amber-700/80 text-white',
  scenic:     'bg-emerald-700/80 text-white',
  landmark:   'bg-blue-700/80 text-white',
  beach:      'bg-orange-700/80 text-white',
  market:     'bg-purple-700/80 text-white',
  adventure:  'bg-green-700/80 text-white',
  rooftop:    'bg-stone-700/80 text-white',
}

export default function PlaceCard({ place }: { place: Place }) {
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { save, remove, isSaved } = useWishlist()
  const saved = isSaved(place.id)

  function handlePlay() {
    setPlaying(true)
    setTimeout(() => videoRef.current?.play(), 50)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:border-gray-200">
      <div className="relative w-full h-44 bg-black overflow-hidden">
        {!playing && (
          <img
            src={place.photo}
            alt={place.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80'
            }}
          />
        )}
        <video
          ref={videoRef}
          src={place.video}
          loop muted playsInline
          controls={playing}
          className={`w-full h-full object-cover absolute inset-0 ${playing ? 'opacity-100' : 'opacity-0'}`}
        />
        {!playing && (
          <button
            onClick={handlePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/25 hover:bg-black/35 transition-opacity"
          >
            <div className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 transition-transform">
              <div className="w-0 h-0 border-t-[9px] border-b-[9px] border-l-[15px] border-transparent border-l-gray-900 ml-1" />
            </div>
          </button>
        )}
        <span className={`absolute top-2.5 left-2.5 text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm ${CAT_BADGE[place.cat] || 'bg-black/50 text-white'}`}>
          {place.cat}
        </span>
        <span className="absolute top-2.5 right-2.5 text-xs px-2.5 py-1 rounded-full bg-black/55 text-white backdrop-blur-sm">
          {place.city}
        </span>
        <button
          onClick={() => saved ? remove(place.id) : save(place)}
          className={`absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all backdrop-blur-sm border ${saved ? 'bg-rose-500 border-rose-400 text-white' : 'bg-white/80 border-white/60 text-gray-600 hover:bg-white'}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
      <div className="px-3.5 py-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-medium text-gray-900 leading-snug">{place.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{place.city}, {place.country}</p>
          </div>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${CAT_COLORS[place.cat] || 'bg-gray-100 text-gray-600'}`}>
            {place.cat}
          </span>
        </div>
        <div className="flex items-center justify-between mt-2.5">
          <span className="text-xs text-gray-500">★ {place.rating.toFixed(1)} · {formatArea(place.area)}</span>
        </div>
        <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{place.desc}</p>
      </div>
    </div>
  )
}
