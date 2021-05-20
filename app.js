var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./docs')
var indexRouter = require('./routes/index');
const expressJwt = require('express-jwt')

const jwtMiddleware = expressJwt({
	secret: Buffer.from(process.env.JWT_SUPER_SECRET, 'base64'),
  algorithms: ['sha1', 'RS256', 'HS256'],
})

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req,res)=> {
  res.redirect('/api-docs')
})
app.use(`/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocument, { "showExplorer": true }))
app.use('/restaurants', jwtMiddleware, indexRouter);
// catch 404 and forward to error handler */
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
