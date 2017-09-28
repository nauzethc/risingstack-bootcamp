const Koa = require('koa')
const Router = require('koa-router')
const winston = require('winston')

// Config
const PORT = Number(process.env.PORT) || 3000
const app = new Koa()
const router = new Router()

// Routes
router.get('/hello', (ctx) => { ctx.body = 'Hello Node.js!' })

// Middleware
app.use(router.routes())
app.use(router.allowedMethods())

// Start
const server = app.listen(PORT)
winston.info(`Server running at localhost:${PORT}`)

module.exports = server
