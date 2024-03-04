var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var compression = require('compression');
var session = require('express-session');
var clc = require('cli-color');
var util = require('./modjs/util/index');

var usersRouter = require('./routes/users');

var app = express();

Date.prototype.formatTime = function (format, ifUTC) {
  return util.formatTime(this, format, ifUTC);
}

//consle前面自动加时间戳
require('console-stamp')(console, {
  pattern: 'yyyy-mm-dd HH:MM:ss.l',
  colors: {
    stamp: 'yellow',
    label: 'white',
    metadata: 'green'
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//gzip压缩，需要放在前面才有效
app.use(compression());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  name: 'crm',
  secret: 'crm',
  cookie: {
    maxAge: 24 * 7 * 60 * 60 * 1000, //1个礼拜
    secure: false
  },
  rolling: false,
  resave: false,
  saveUninitialized: false,
}));

app.use(function (req, res, next) {
  if (req.originalUrl.startsWith('/crm_api/') == -1 &&
    req.originalUrl.startsWith('/crm_h5/') == -1 &&
    req.originalUrl !== '/favicon.ico') {
    res.send('404');
    return;
  }
  if (process.env.NODE_ENV != 'production') {
    req.session.uid = req.session.uid || req.query.uid;
  }
  if (!req.session.uid &&
    req.originalUrl !== '/favicon.ico' &&
    !req.originalUrl.startsWith('/crm_h5/') &&
    !req.originalUrl.startsWith('/crm_api/user/login')) {
    res.redirect('/crm_h5/login.html');
  } else {
    next();
  }
});

//请求时间戳
app.use((req, res, next) => {
  res.once('finish', () => {
    process.stdout.write(`[${clc.yellow(util.formatTime(new Date()))}] ${clc.green('finish')}\n`);
  });
  res.once('close', () => {
    process.stdout.write(`[${clc.yellow(util.formatTime(new Date()))}] ${clc.red('close')}\n`);
  });
  next();
});

app.use('/crm_api/user', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;