import { Place } from '../data/places'

const BASE = 'http://localhost:3001/api'

export const SEARCH_QUERIES = [
  { query: 'best restaurants Tokyo',       cat: 'restaurant', region: 'Asia'        },
  { query: 'best restaurants Paris',       cat: 'restaurant', region: 'Europe'      },
  { query: 'best restaurants New York',    cat: 'restaurant', region: 'Americas'    },
  { query: 'best restaurants Bangkok',     cat: 'restaurant', region: 'Asia'        },
  { query: 'best restaurants Rome',        cat: 'restaurant', region: 'Europe'      },
  { query: 'best restaurants Mumbai',      cat: 'restaurant', region: 'Asia'        },
  { query: 'best restaurants Mexico City', cat: 'restaurant', region: 'Americas'    },
  { query: 'best restaurants Cape Town',   cat: 'restaurant', region: 'Africa'      },
  { query: 'best restaurants Dubai',       cat: 'restaurant', region: 'Middle East' },
  { query: 'best restaurants Sydney',      cat: 'restaurant', region: 'Oceania'     },
  { query: 'scenic viewpoints Bali',       cat: 'scenic',     region: 'Asia'        },
  { query: 'scenic spots Patagonia',       cat: 'scenic',     region: 'Americas'    },
  { query: 'scenic places Iceland',        cat: 'scenic',     region: 'Europe'      },
  { query: 'scenic viewpoints Santorini',  cat: 'scenic',     region: 'Europe'      },
  { query: 'scenic spots New Zealand',     cat: 'scenic',     region: 'Oceania'     },
  { query: 'scenic places Jordan',         cat: 'scenic',     region: 'Middle East' },
  { query: 'scenic viewpoints Kyoto',      cat: 'scenic',     region: 'Asia'        },
  { query: 'scenic spots Cape Town',       cat: 'scenic',     region: 'Africa'      },
  { query: 'beaches Maldives',             cat: 'beach',      region: 'Asia'        },
  { query: 'beaches Tulum Mexico',         cat: 'beach',      region: 'Americas'    },
  { query: 'beaches Phuket Thailand',      cat: 'beach',      region: 'Asia'        },
  { query: 'beaches Amalfi Coast',         cat: 'beach',      region: 'Europe'      },
  { query: 'beaches Sydney Australia',     cat: 'beach',      region: 'Oceania'     },
  { query: 'beaches Bali',                 cat: 'beach',      region: 'Asia'        },
  { query: 'nightlife Ibiza',              cat: 'party',      region: 'Europe'      },
  { query: 'nightlife Mykonos',            cat: 'party',      region: 'Europe'      },
  { query: 'nightlife Bangkok',            cat: 'party',      region: 'Asia'        },
  { query: 'nightlife Miami',              cat: 'party',      region: 'Americas'    },
  { query: 'nightlife Berlin',             cat: 'party',      region: 'Europe'      },
  { query: 'nightlife Tokyo',              cat: 'party',      region: 'Asia'        },
  { query: 'adventure sports Queenstown',  cat: 'adventure',  region: 'Oceania'     },
  { query: 'adventure sports Interlaken',  cat: 'adventure',  region: 'Europe'      },
  { query: 'hiking Patagonia',             cat: 'adventure',  region: 'Americas'    },
  { query: 'adventure activities Dubai',   cat: 'adventure',  region: 'Middle East' },
  { query: 'street markets Marrakech',     cat: 'market',     region: 'Africa'      },
  { query: 'street markets Istanbul',      cat: 'market',     region: 'Europe'      },
  { query: 'night markets Bangkok',        cat: 'market',     region: 'Asia'        },
  { query: 'markets Tokyo',               cat: 'market',     region: 'Asia'        },
  { query: 'landmarks Rome',               cat: 'landmark',   region: 'Europe'      },
  { query: 'landmarks Paris',              cat: 'landmark',   region: 'Europe'      },
  { query: 'landmarks Dubai',              cat: 'landmark',   region: 'Middle East' },
  { query: 'rooftop bars Singapore',       cat: 'rooftop',    region: 'Asia'        },
  { query: 'rooftop bars New York',        cat: 'rooftop',    region: 'Americas'    },
  { query: 'rooftop bars Bangkok',         cat: 'rooftop',    region: 'Asia'        },
]

function extractCity(components: any[]): string {
  if (!components) return 'Unknown'
  return components.find((c: any) =>
    c.types?.includes('locality') || c.types?.includes('administrative_area_level_1')
  )?.longText || 'Unknown'
}

function extractCountry(components: any[]): string {
  if (!components) return 'Unknown'
  return components.find((c: any) => c.types?.includes('country'))?.longText || 'Unknown'
}

function randomArea(cat: string): number {
  const ranges: Record<string, [number, number]> = {
    restaurant: [0.01, 0.05],
    rooftop:    [0.02, 0.08],
    market:     [0.1,  5],
    party:      [0.05, 3],
    landmark:   [0.1,  10],
    scenic:     [10,   100000],
    beach:      [1,    500],
    adventure:  [5,    10000],
  }
  const [min, max] = ranges[cat] || [0.1, 100]
  return parseFloat((Math.random() * (max - min) + min).toFixed(2))
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

export async function fetchAllPlaces(
  onProgress?: (done: number, total: number) => void
): Promise<Place[]> {
  const results: Place[] = []
  const total = SEARCH_QUERIES.length

  for (let qi = 0; qi < total; qi++) {
    const { query, cat, region } = SEARCH_QUERIES[qi]
    try {
      const gRes = await fetch(`${BASE}/places?query=${encodeURIComponent(query)}&limit=10`)
      const gData = await gRes.json()
      const places = gData.places || []

      for (const p of places) {
        const city = extractCity(p.addressComponents)
        const videoQuery = `${city} ${cat}`

        const vRes = await fetch(`${BASE}/video?query=${encodeURIComponent(videoQuery)}&per_page=1`)
        const vData = await vRes.json()
        const videoFile = vData.videos?.[0]?.video_files?.find(
          (f: any) => f.quality === 'hd' || f.quality === 'sd'
        )

        let photoUrl = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80'
        const photoRef = p.photos?.[0]?.name
        if (photoRef) {
          const pRes = await fetch(`${BASE}/photo?ref=${encodeURIComponent(photoRef)}&maxWidth=600`)
          const pData = await pRes.json()
          if (pData.photoUri) photoUrl = pData.photoUri
        }

        results.push({
          id: results.length + 1,
          name: p.displayName?.text || query,
          city,
          country: extractCountry(p.addressComponents),
          region,
          cat,
          area: randomArea(cat),
          rating: p.rating || 4.0,
          photo: photoUrl,
          video: videoFile?.link || '',
          desc: p.editorialSummary?.text || `${cat} in ${city}`,
        })
      }

      onProgress?.(qi + 1, total)
      await sleep(200)
    } catch (err) {
      console.warn(`Failed: ${query}`, err)
    }
  }

  return results
}
