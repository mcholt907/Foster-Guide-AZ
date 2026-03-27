import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import chatRouter from './routes/chat.js'

const app = express()
const allowedOrigins = process.env.DEV_TUNNEL === 'true'
  ? '*'
  : (process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173').split(',').map(o => o.trim())
app.use(cors({ origin: allowedOrigins }))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', version: '0.1.0' })
})

app.use('/api/chat', chatRouter)

export { app }

const PORT = Number(process.env.PORT ?? 3001)
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://0.0.0.0:${PORT}`))
