import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config({ path: '../.env' })

const app = express()
const PORT = 3001
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

const GOOGLE_KEY = process.env.VITE_GOOGLE_PLACES_KEY!
const PEXELS_KEY = process.env.VITE_PEXELS_API_KEY!

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', google: !!GOOGLE_KEY, pexels: !!PEXELS_KEY })
})

app.get('/api/places', async (req, res) => {
  const query = req.query.query as string
  const limit = parseInt(req.query.limit as string) || 20
  if (!query) { res.status(400).json({ error: 'query param required' }); return }
  try {
    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.photos,places.editorialSummary,places.addressComponents',
      },
      body: JSON.stringify({ textQuery: query, pageSize: Math.min(limit, 20), languageCode: 'en' }),
    })
    const data = await response.json()
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: 'Google Places failed' })
  }
})

app.get('/api/photo', async (req, res) => {
  const ref = req.query.ref as string
  const maxWidth = req.query.maxWidth || '600'
  if (!ref) { res.status(400).json({ error: 'ref required' }); return }
  try {
    const response = await fetch(`https://places.googleapis.com/v1/${ref}/media?maxWidthPx=${maxWidth}&key=${GOOGLE_KEY}&skipHttpRedirect=true`)
    const data = await response.json()
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: 'Photo fetch failed' })
  }
})

app.get('/api/video', async (req, res) => {
  const query = req.query.query as string
  const perPage = req.query.per_page || '5'
  if (!query) { res.status(400).json({ error: 'query required' }); return }
  try {
    const response = await fetch(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`,
      { headers: { Authorization: PEXELS_KEY } }
    )
    const data = await response.json()
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: 'Pexels fetch failed' })
  }
})

app.listen(PORT, () => console.log(`Proxy running on http://localhost:${PORT}`))
