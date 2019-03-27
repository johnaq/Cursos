var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var flash = require('connect-flash');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cursosRouter = require('./routes/cursos');

var app = express();

//Boostrap
const dirNode_modules = path.join(__dirname , './node_modules');
app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//se habilita la session
app.use(session({ cookie: { maxAge: 60000 }, 
  secret: 'nodejs',
  resave: false, 
  saveUninitialized: false}));
app.use(flash());

//mensajes
app.use(function(req, res, next){
  res.locals.mensajeExito = req.flash('mensajeExito');
  res.locals.mensajeError = req.flash('mensajeError');
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/cursos', cursosRouter);

// catch 404 and forward to error handler
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
