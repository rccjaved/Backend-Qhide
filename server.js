// server.js
const express      = require('express')
const bodyParser   = require('body-parser')
const cors         = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const app = express()

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin:      'http://localhost:3000',
  credentials: true,          // <— this plus sameSite:'none' on your cookie
}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Mobile/Public APIs ───────────────────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'))
app.use('/api/ticket',    require('./routes/ticket'))
app.use('/api/hospitals', require('./routes/hospital'))
app.use('/api/services',  require('./routes/service'))
app.use('/api',           require('./routes/appointments'))

// ── Dashboard/Admin APIs ────────────────────────────────────────────────────
// Mount your dashboard‐auth under its own sub-path:
app.use('/api/dashboard/auth',      require('./routes/authRoutes'))
// Mount your hospital management under a parallel sub-path:
app.use('/api/dashboard/hospitals', require('./routes/dashboard/hospitalRoutes'))

// ── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
