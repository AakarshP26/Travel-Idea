import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Place } from '../data/places'

interface WishlistState {
  saved: Place[]
  save: (place: Place) => void
  remove: (id: number) => void
  isSaved: (id: number) => boolean
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      saved: [],
      save: (place) => set((s) => ({ saved: [...s.saved, place] })),
      remove: (id) => set((s) => ({ saved: s.saved.filter((p) => p.id !== id) })),
      isSaved: (id) => get().saved.some((p) => p.id === id),
    }),
    { name: 'travel-wishlist' }
  )
)
