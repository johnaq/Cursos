var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var flash = require('connect-flash');
var hbs = require('hbs');
var mongoose = require('mongoose');
require('./helpers/helpers');

var usuariosRouter = require('./routes/usuarios');
var cursosRouter = require('./routes/cursos');
var loginRouter = require('./routes/login');
var inscripcionesRouter = require('./routes/inscripciones');
var chatRouter = require('./routes/chat')

var app = express();

//Boostrap
const dirNode_modules = path.join(__dirname , './node_modules');
app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));
app.use('/js', express.static(dirNode_modules + '/public/js'));

hbs.registerPartials(path.join(__dirname, 'views/partials'))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//se habilita la session
app.use(session({ cookie: { maxAge: 600000 }, 
  secret: 'nodejs',
  resave: false, 
  saveUninitialized: false}));
app.use(flash());

//middleware
app.use(function(req, res, next){
  if(req.url != "/" && req.url != "/usuarios/nuevo" && req.url != "/salir"){
    if(!req.session.usuario){
      req.flash('mensajeError', 'No tiene permisos')
      res.redirect('/')
      return;
    }
  }
  if(req.session.usuario){
    res.locals.session = true;
    res.locals.coordinador = (req.session.usuario.rolUsuario == 'Coordinador') ? true : false;
    res.locals.aspirante = (req.session.usuario.rolUsuario == 'Aspirante') ? true : false;

    //Se debe convertir el Uint8Array a un buffer antes de realizar la conversion a base64
    if(req.session.usuario.fotoPerfil != undefined){
      var buffer = Buffer.from(req.session.usuario.fotoPerfil.data);
      res.locals.avatar = `data:${req.session.usuario.fotoPerfil.contentType};base64,` + buffer.toString('base64')
    }
  }
  res.locals.mensajeExito = req.flash('mensajeExito');
  res.locals.mensajeError = req.flash('mensajeError');
  next()
});


app.use('/', loginRouter);
app.use('/usuarios', usuariosRouter);
app.use('/cursos', cursosRouter);
app.use('/inscripciones', inscripcionesRouter);
app.use('/chat', chatRouter);

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

mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.URLDB, {useNewUrlParser: true}, (err, result) => {
  if(err){
    return console.log(err)
  }
  console.log('Conectado')
});

module.exports = app;