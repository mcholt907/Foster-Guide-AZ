import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import chatRouter from './routes/chat.js'

const app = express()
app.use(cors({ origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173' }))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', version: '0.1.0' })
})

app.use('/api/chat', chatRouter)

export { app }

const PORT = Number(process.env.PORT ?? 3001)
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
