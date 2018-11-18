var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var swaggerUi = require('swagger-ui-express')
var swaggerDocument = require('./swagger.json')

var indexRouter = require('./src/routes/index')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'src/views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(function (req, res, next) {
  var _send = res.send
  var sent = false
  res.send = function (data) {
    if (sent) return
    _send.bind(res)(data)
    sent = true
  }
  next()
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use('/api', indexRouter)

app.get('/', function (req, res) {
  res.render('index', {
    title: 'Hey',
    message: 'Welcome to Population Management Systme!'
  })
})

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
